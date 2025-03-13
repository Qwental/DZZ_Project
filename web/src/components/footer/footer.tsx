import styles from './footer.module.css';

export default function Footer(){
    return (
    <footer className={styles.footer}>
    <div className={styles.container}>
        <div className={styles.footerContent}>
            <div className={styles.footerInfo}>
                <h2 className={styles.footerHeader}>О нас</h2>
                <span className={styles.footer__text}>Мы&nbsp;используем передовые алгоритмы машинного обучения и&nbsp;анализ
                    больших данных для обработки спутниковых снимков Приморского края. Наш сервис обеспечивает
                    высокую точность распознавания лесных участков, вырубок, гарей и&nbsp;пашни, предоставляя
                    актуальную информацию для мониторинга лесных ресурсов.</span>
            </div>
            <div className={styles.footer__contact}>
                <h2 className={styles.footer__header}>Контакты</h2>
                <div className={styles.footerContactsWrapper}>
                    <link className={styles.footerLinkfooterLinkBold} href="tel:88000000000">
                        <img className={styles.footerLinkImage} src="images/phone3.png" width="12" height="12"
                            alt="Иконка телефона"/>
                        <span className={styles.footerLinkText}>8 (800) 000-00-00</span>
                    </link>
                    <link className={styles.footerLinkfooterLinkMail} href="mailto:email@email.com">
                        <img className={styles.footerLinkImage} src="images/mail3.png" width="12" height="12"
                            alt="Иконка почты"/>
                        <span className={styles.footerLinkText}>email@email.com</span>
                    </link>
                    <link className={styles.footerLinkfooterLinkPoint} href="#">
                        <img className={styles.footerLinkImage} src="images/point3.png" width="12" height="12"
                            alt="Иконка навигации"/>
                        <span className={styles.footerLinkText}>г.Москва, ул. Петровско-Разумовская, 145, оф.34</span>
                    </link>
                </div>
            </div>
        </div>
    </div>
</footer>
);
}