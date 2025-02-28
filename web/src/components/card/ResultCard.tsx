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

          {/* <div className={styles.resText}>
            <p className={styles.sectionTitle}>Обозначенные участки:</p>
            <div className={styles.legendItem}>
              <svg
                className={styles.markerIcon}
                viewBox="0 0 19 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9.5" cy="9.5" r="9.5" fill="#FF0000" />
              </svg>
              <div className={styles.legendText}>
                <p className={styles.legendTitle}>Гарь</p>
                <p className={styles.legendDescription}>
                  Территория, пострадавшая от лесного пожара
                </p>
              </div>
            </div>
          </div> */}
          <LegendAccordion type="blaze"></LegendAccordion>

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
