import styles from './header.module.css';

export default function Header(){
    return (
    <header className={styles.header}>
    <div className={styles.container}>
        <div className={styles.content}>
            <a className={styles.link} href="#">
                <img className={styles.logo} src="images/logo3.png" alt="Логотип" />
            </a>
            <div className={styles.middle}>
                <form className={styles.search} action="#" method="GET">
                    <input className={styles.searchField} type="search" aria-label="Поле поиска" name="search-field"
                        placeholder="поиск" />
                    {/* <svg className={styles.searchIcon} width="12" height="12" aria-hidden="true">
                        <use xlink:href="images/sprite.svg#icon-search"></use>
                    </svg> */}
                </form>
            </div>
            <ul className={styles.nav}>
                <li className={styles.navItem}>
                    <a className={styles.navLink} href="#">Инструкция</a>
                </li>
                <li className={styles.navItem}>
                    <a className={styles.navLink} href="#">Форма</a>
                </li>
                <li className={styles.navItem}>
                    <a className={styles.navLink} href="#">Регистрация</a>
                </li>
                <li className={styles.navItem}>
                    <a className={styles.navLink} href="#">Личный кабинет</a>
                </li>
            </ul>
        </div>
    </div>
</header>
);
}