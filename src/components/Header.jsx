import Styles from './Header.module.css';

function Header() {
    return(
        <h1 className={Styles['header-title']}><span>MTG</span> Keyword Helper</h1>
    )
}

export default Header;