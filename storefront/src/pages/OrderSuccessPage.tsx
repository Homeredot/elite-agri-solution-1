import { ArrowRight, CheckCircle2, UserRound } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentReference = searchParams.get("reference");
  return (
    <div className="page-stack">
      <section className="glass success-stage">
        <p className="eyebrow">Order placed</p>
        <h1 className="title-with-icon">
          <span className="title-icon">
            <CheckCircle2 size={20} />
          </span>
          Thanks. Your order has been received.
        </h1>
        <p>Order reference: {searchParams.get("orderNumber") || "Pending reference"}</p>
        {paymentReference ? <p>Payment reference: {paymentReference}</p> : null}
        <div className="hero-actions">
          <Link to="/catalog" className="primary-btn">
            <ArrowRight size={16} />
            Continue shopping
          </Link>
          <Link to={orderId ? `/account/orders/${orderId}` : "/account/orders"} className="secondary-btn">
            <UserRound size={16} />
            View your order
          </Link>
        </div>
      </section>
    </div>
  );
};
