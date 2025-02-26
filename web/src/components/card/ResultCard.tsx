import classNames from "classnames";
import styles from "./card.module.css";
import Card from "./card";
import Image from "next/image";
import Button from "../button/button";

const ResultCard: React.FC = () => {
  const cardClass = classNames(styles.card_result);

  return (
    <Card>
      {" "}
      <div className={cardClass}>
        <h2 className={styles.headText}>Ваш результат</h2>
        <Image
          src={"https://loremflickr.com/518/407"}
          alt="result"
          width={518}
          height={407}
          className={styles.image}
        />
        <div>
          <Button variant="mint" size="medium">
            meow
          </Button>
          <Button variant="green" size="medium">
            meow
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard;
