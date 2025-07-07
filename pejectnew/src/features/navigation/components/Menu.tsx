import React, { useRef, useEffect } from 'react';
import styles from '../styles/Menu.module.css';
import useMenuAnimation from '../hooks/useMenuAnimation'; // Import the hook

interface MenuProps {
  isOpen: boolean;
  onCloseMenu: () => void;
  onNavigate: (sectionId: string) => void;
}

const ArrowIcon = () => (
  <svg className={styles.arrowSvgIcon} width="12" height="12" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.96074 1.80252L0 8.76327L1.23673 10L8.19718 3.03955V9.38153H9.94619L9.94626 1.29047L10 1.23673L9.94626 1.18299L9.94626 0.053524L8.81679 0.0535202L8.76327 0L8.70975 0.0535202L0.618255 0.0535244V1.80252L6.96074 1.80252Z" fill="currentColor" />
  </svg>
);

const Menu: React.FC<MenuProps> = ({ isOpen, onCloseMenu, onNavigate }) => {
  const {
    desktopMenuRef,
    menuBackdropRef,
    menuBackgroundRef,
    menuContentRef,
    desktopMenuItemsRef,
    desktopMenuLinksRef,
    menuDividerRef,
    mobileMenuRef,
    mobileMenuItemsRef,
    mobileMenuLinkButtonsRef,
  } = useMenuAnimation({ isOpen }); // Use the hook

  // Refs for menu items - to be populated and passed to the hook
  const dMenuItemsRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const dMenuLinksRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mMenuItemsRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const mMenuLinksBtnRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    desktopMenuItemsRef.current = dMenuItemsRefs.current;
    desktopMenuLinksRef.current = dMenuLinksRefs.current;
    mobileMenuItemsRef.current = mMenuItemsRefs.current;
    mobileMenuLinkButtonsRef.current = mMenuLinksBtnRefs.current;
  }, [isOpen]); // Update refs if isOpen changes, though refs themselves shouldn't change often

  const desktopMenuItemsData = [
    { id: 'hero-section', label: 'Main' },
    { id: 'presentation-section', label: 'Meet Radiance' },
    { id: 'estimates-slide', label: 'Our Approach' },
    { id: 'portfolio-section', label: 'Selected Works' },
    { id: 'footer', label: 'Contacts' },
  ];

  const mobileMenuItemsData = desktopMenuItemsData;

  const desktopLinksData = [
    { href: "/de/", label: "DEUTSCHE VERSION", external: false },
    { href: "mailto:hello@radiance.family?subject=Let's%20work%20together", label: "HELLO@RADIANCE.FAMILY", external: true },
    { href: "https://t.me/Arturkay", label: "TELEGRAM", external: true },
  ];

  const mobileLinksData = [
    { href: "mailto:HELLO@radiance.family?subject=WE%20HAVE%20A%20PROJECT", label: "HELLO@RADIANCE.FAMILY", icon: true, accent: "blueAccent", external: true},
    { href: "https://www.instagram.com/designbyradiance/", label: "INSTAGRAM", icon: true, external: true },
    { href: "https://t.me/Arturkay", label: "TELEGRAM", icon: true, external: true },
    { href: "https://www.behance.net/radiancefamily", label: "BEHANCE", icon: true, external: true },
    { href: "/de/", label: "DEUTSCHE", icon: true, accent: "pinkAccent", external: false },
  ];

  // Ensure refs arrays are reset/re-populated correctly if items change, though they are static here.
  useEffect(() => {
    dMenuItemsRefs.current = dMenuItemsRefs.current.slice(0, desktopMenuItemsData.length);
    dMenuLinksRefs.current = dMenuLinksRefs.current.slice(0, desktopLinksData.length);
    mMenuItemsRefs.current = mMenuItemsRefs.current.slice(0, mobileMenuItemsData.length);
    mMenuLinksBtnRefs.current = mMenuLinksBtnRefs.current.slice(0, mobileLinksData.length);
  }, [desktopMenuItemsData.length, desktopLinksData.length, mobileMenuItemsData.length, mobileLinksData.length]);


  return (
    <>
      <div
        ref={menuBackdropRef}
        className={`${styles.menuBackdrop} ${styles.bgNoise} menu-backdrop ${isOpen ? styles.open : ''}`}
        onClick={onCloseMenu}
        aria-hidden={!isOpen}
      />
      <div ref={menuBackgroundRef} className={`${styles.menuBackground} menu-background ${isOpen ? styles.open : ''}`} aria-hidden={!isOpen} />

      <section ref={desktopMenuRef} id="menu-section" className={`${styles.menuDesktop} menu ${isOpen ? styles.open : ''}`} aria-hidden={!isOpen}>
        <div ref={menuContentRef} className={styles.menuPopupLayout}> {/* menuContentRef is for the content wrapper */}
          <div className={styles.menuContent}>
            <div className={styles.menuItems}>
              {desktopMenuItemsData.map((item, index) => (
                <a
                  key={item.id}
                  ref={el => dMenuItemsRefs.current[index] = el}
                  id={`anchor-${item.id.split('-')[0]}`}
                  className={`${styles.animatedMenuLink} animated-menu-link`}
                  onClick={() => { onNavigate(item.id); onCloseMenu(); }}
                  href={`#${item.id}`}
                >
                  <h2>{item.label}</h2>
                </a>
              ))}
            </div>
            <div ref={menuDividerRef} className={styles.menuDivider} />
            <div className={styles.menuLinks}>
              {desktopLinksData.map((link, index) => (
                <div key={link.label} ref={el => dMenuLinksRefs.current[index] = el} className={`${styles.linkItem} ${styles.menuAnimLink} menu-anim-link`}>
                  <ArrowIcon />
                  <a href={link.href} className={styles.animatedLink} target={link.external ? "_blank" : "_self"} rel={link.external ? "noopener noreferrer" : ""}>
                    <span>{link.label}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={mobileMenuRef} className={`${styles.menuMobile} mobile-menu ${isOpen ? styles.open : ''}`} aria-hidden={!isOpen}>
        <div className={styles.mobileMenuLayout}>
          <div className={styles.topSpacer}></div>
          <div className={styles.menuItems}>
            {mobileMenuItemsData.map((item, index) => (
              <a
                key={`m-${item.id}`}
                ref={el => mMenuItemsRefs.current[index] = el}
                id={`anchor-${item.id.split('-')[0]}-m`}
                className={`${styles.animatedMenuLink} animated-menu-link`}
                onClick={() => { onNavigate(item.id); onCloseMenu(); }}
                href={`#${item.id}`}
              >
                <h3>{item.label}</h3>
              </a>
            ))}
          </div>
          <div className={styles.menuLinkButtons}>
            {mobileLinksData.map((link, index) => (
                 <a
                    key={link.label}
                    ref={el => mMenuLinksBtnRefs.current[index] = el}
                    href={link.href}
                    target={link.external ? "_blank" : "_self"}
                    rel={link.external ? "noopener noreferrer" : ""}
                    className={`${styles.menuButtonLink} menu-button-link menu-button-top ${link.accent ? styles[link.accent] : ''}`}
                >
                    <div className={styles.textBlock}>{link.label}</div>
                    {link.icon && <ArrowIcon />}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Menu;
