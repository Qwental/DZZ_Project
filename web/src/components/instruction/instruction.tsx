import Link from 'next/link';
import styles from './instruction.module.css';

export default function Instruction(){
    return (
        <section className={styles.instruction}>
            <div className={styles.container}>
                <div className={styles.instructionWrapper}>
                    <div className={styles.instructionWrapperLeft}>
                        <Link className={styles.instructionLink} href="#">Как пользоваться?</Link>
                        <h2 className={styles.instructionHeader}>Инструкция по использованию</h2>
                        <span className={styles.instructionText}>Мы подробно рассмотрим, как использовать сервис <b>ForestWatch Приморье</b> для распознавания участков</span>
                    </div>
                    <div className={styles.instructionWrapperRight}>
                        <ul className={styles.instructionWrapperSteps}>
                            <li className={styles.instructionWrapperStepsItem}>
                                <h3 className={styles.instructionWrapperStepsNumber}>01</h3>
                                <span className={styles.instructionText}>Откройте вкладку Форма для загрузки</span>
                            </li>
                            <li className={styles.instructionWrapperStepsItem}>
                                <h3 className={styles.instructionWrapperStepsNumber}>02</h3>
                                <span className={styles.instructionText}>Добавьте один или несколько файлов формата: <b>JPG, PNG</b></span>
                            </li>
                            <li className={styles.instructionWrapperStepsItem}>
                                <h3 className={styles.instructionWrapperStepsNumber}>03</h3>
                                <span className={styles.instructionText}>Нажмите кнопку отправить и наблюдайте результат в форме Ваш результат</span>
                            </li>
                            <li className={styles.instructionWrapperStepsItem}>
                                <h3 className={styles.instructionWrapperStepsNumber}>04</h3>
                                <div className={styles.instructionWrapperStepsContenet}>
                                    <span className={styles.instructionText}>Цвета выделенных участков:</span>
                                    <ul className={styles.instructionWrapperColors}>
                                        <li className={styles.instructionWrapperColorsIteminstructionWrapperColorsItemRed}>
                                            <span className={styles.instructionWrapperColorsName}>Гарь</span>
                                        </li>
                                        <li className={styles.instructionWrapperColorsIteminstructionWrapperColorsItemPurple}>
                                            <span className={styles.instructionWrapperColorsName}>Лес</span>
                                        </li>
                                        <li className={styles.instructionWrapperColorsItem}>
                                            <span className={styles.instructionWrapperColorsName}>Вырубка</span>
                                        </li>
                                        <li className={styles.instructionWrapperColorsIteminstructionWrapperColorsItemOrange}>
                                            <span className={styles.instructionWrapperColorsName}>Пашня</span>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <img className={styles.instructionWrapperImage} src="images/map.jpg" width="390" height="275" alt="Карта"/>
                </div>
            </div>
        </section>
    );
}

