import { type Brand } from "@/lib/jobs";
import styles from "./brand-tag.module.css";

const BRAND_CLASS: Record<Brand, string> = {
  Ovrload: styles.ovrload,
  Cloud: styles.cloud,
};

export default function BrandTag({ brand }: { brand: Brand }) {
  return (
    <span className={`${styles.chip} ${BRAND_CLASS[brand]}`}>
      {brand.toLowerCase()}
    </span>
  );
}
