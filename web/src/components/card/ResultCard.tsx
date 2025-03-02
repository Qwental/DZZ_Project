import classNames from "classnames";
import styles from "./card.module.css";
import Card from "./card";
import Image from "next/image";
import Button from "../button/button";
import Carousel from "../carousel/carousel";
import LegendAccordion from "../LegendAccordion/LegendAccordion";

const ResultCard: React.FC = () => {
  const cardClass = classNames(styles.card_result);
  const previewUrls = [
    "https://i.imgur.com/YzFSzED.jpeg",
    "https://i.imgur.com/3giN25k.jpeg",
  ];

  return (
    <div className={styles.mainContent}>
      <Card>
        <div className={styles.carouselContainer}>
          <h2 className={styles.headText}>Ваш результат</h2>

          <div className={styles.imageWrapper}>
            <Carousel previewUrls={previewUrls} />
          </div>

          <LegendAccordion></LegendAccordion>

          <div className={styles.buttonsWrapper}>
            <Button
              size="large"
              type="submit"
              variant="mint"
              disabled={previewUrls.length === 0}
            >
              Скачать ({previewUrls.length})
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResultCard;
