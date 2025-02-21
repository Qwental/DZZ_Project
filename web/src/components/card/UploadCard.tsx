import classNames from "classnames";
import styles from "./card.module.css";
import Card from "./card";

const UploadCard: React.FC = () => {
  const cardClass = classNames(styles.card_upload);

  return (
    <Card>
      <div className={cardClass}>
        <h2 className={styles.headText}>Загрузка изображения</h2>
        <div
          style={{ width: "100px", height: "100px", backgroundColor: "gray" }}
        ></div>
      </div>
    </Card>
  );
};

export default UploadCard;
