import net from "node:net";
import tls from "node:tls";
import { env } from "../config/env.js";
import { AppError } from "./app-error.js";

type EmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

type SocketLike = net.Socket | tls.TLSSocket;

const CRLF = "\r\n";

const sanitizeHeader = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

const encodeMimeHeader = (value: string) => {
  if (/^[\x20-\x7E]*$/.test(value)) {
    return sanitizeHeader(value);
  }

  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
};

const buildMimeBody = ({ to, subject, text, html }: EmailInput) => {
  const fromAddress = env.SMTP_FROM || env.SMTP_USER || "no-reply@localhost";
  const boundary = `boundary_${Date.now().toString(36)}`;
  const headers = [
    `From: ${encodeMimeHeader(fromAddress)}`,
    `To: ${encodeMimeHeader(to)}`,
    `Subject: ${encodeMimeHeader(subject)}`,
    "MIME-Version: 1.0"
  ];

  if (html) {
    headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);

    return [
      ...headers,
      "",
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: 8bit",
      "",
      text,
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      "Content-Transfer-Encoding: 8bit",
      "",
      html,
      `--${boundary}--`,
      ""
    ].join(CRLF);
  }

  headers.push('Content-Type: text/plain; charset="UTF-8"');
  headers.push("Content-Transfer-Encoding: 8bit");

  return [...headers, "", text, ""].join(CRLF);
};

const waitForSocketConnect = (socket: SocketLike) =>
  new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      socket.off("error", onError);
      socket.off("connect", onConnect);
      socket.off("secureConnect", onSecureConnect);
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };
    const onConnect = () => {
      cleanup();
      resolve();
    };
    const onSecureConnect = () => {
      cleanup();
      resolve();
    };

    socket.once("error", onError);
    socket.once("connect", onConnect);
    socket.once("secureConnect", onSecureConnect);
  });

const readSmtpResponse = (socket: SocketLike) =>
  new Promise<{ code: number; message: string }>((resolve, reject) => {
    let response = "";

    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
      socket.off("close", onClose);
      socket.off("end", onClose);
    };

    const tryResolve = () => {
      const lines = response.split(/\r?\n/).filter(Boolean);
      if (!lines.length) {
        return;
      }

      const lastLine = lines[lines.length - 1];
      const match = lastLine.match(/^(\d{3})[ -](.*)$/);
      if (!match || lastLine[3] !== " ") {
        return;
      }

      cleanup();
      resolve({
        code: Number(match[1]),
        message: lines.join("\n")
      });
    };

    const onData = (chunk: Buffer | string) => {
      response += chunk.toString();
      tryResolve();
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const onClose = () => {
      cleanup();
      reject(new Error("SMTP connection closed unexpectedly"));
    };

    socket.on("data", onData);
    socket.once("error", onError);
    socket.once("close", onClose);
    socket.once("end", onClose);
  });

const sendCommand = async (
  socket: SocketLike,
  command: string,
  expectedCodes: number[]
) => {
  socket.write(`${command}${CRLF}`);
  const response = await readSmtpResponse(socket);

  if (!expectedCodes.includes(response.code)) {
    throw new Error(`SMTP command failed (${command}): ${response.message}`);
  }

  return response;
};

const upgradeToTls = async (socket: net.Socket, smtpHost: string) => {
  const secureSocket = tls.connect({
    socket,
    host: smtpHost,
    servername: smtpHost
  });

  await waitForSocketConnect(secureSocket);
  return secureSocket;
};

const ensureEmailConfigured = () => {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    throw new AppError("SMTP is not configured for email delivery", 500);
  }
};

export const sendEmail = async ({ to, subject, text, html }: EmailInput) => {
  ensureEmailConfigured();
  const smtpHost = env.SMTP_HOST as string;
  const smtpUser = env.SMTP_USER as string;
  const smtpPass = env.SMTP_PASS as string;
  const smtpFrom = env.SMTP_FROM || smtpUser;

  const initialSocket =
    env.SMTP_PORT === 465
      ? tls.connect({
          host: smtpHost,
          port: env.SMTP_PORT,
          servername: smtpHost
        })
      : net.createConnection({
          host: smtpHost,
          port: env.SMTP_PORT
        });

  let socket: SocketLike = initialSocket;

  try {
    await waitForSocketConnect(socket);

    const banner = await readSmtpResponse(socket);
    if (banner.code !== 220) {
      throw new Error(`SMTP banner rejected: ${banner.message}`);
    }

    await sendCommand(socket, "EHLO localhost", [250]);

    if (env.SMTP_PORT !== 465) {
      await sendCommand(socket, "STARTTLS", [220]);
      socket = await upgradeToTls(socket as net.Socket, smtpHost);
      await sendCommand(socket, "EHLO localhost", [250]);
    }

    await sendCommand(socket, "AUTH LOGIN", [334]);
    await sendCommand(socket, Buffer.from(smtpUser, "utf8").toString("base64"), [334]);
    await sendCommand(socket, Buffer.from(smtpPass, "utf8").toString("base64"), [235]);
    await sendCommand(socket, `MAIL FROM:<${smtpFrom}>`, [250]);
    await sendCommand(socket, `RCPT TO:<${to}>`, [250, 251]);
    await sendCommand(socket, "DATA", [354]);

    const message = buildMimeBody({ to, subject, text, html })
      .replace(/\r?\n\./g, `${CRLF}..`);

    socket.write(`${message}${CRLF}.${CRLF}`);
    const dataResponse = await readSmtpResponse(socket);
    if (dataResponse.code !== 250) {
      throw new Error(`SMTP DATA failed: ${dataResponse.message}`);
    }

    await sendCommand(socket, "QUIT", [221]);
  } catch (error) {
    throw new AppError(
      error instanceof Error ? error.message : "Failed to send email",
      500
    );
  } finally {
    socket.end();
  }
};
