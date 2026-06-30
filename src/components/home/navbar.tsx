
"use client";


import Image from "next/image";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Languages, LogIn, Moon, Sun, SunMoon, Mail, X, Facebook, Map, Eye, Star, Phone } from "lucide-react";



import { useI18n } from "@/components/providers/i18n-provider";
import { useTheme } from "next-themes";
import { XviFlooLogo } from "@/components/brand/xvifloo-logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#products", labelKey: "nav.products", type: "dropdown" },
  { href: "/#roadmap", labelKey: "nav.roadmap", type: "dropdown" },
  { href: "/#vision", labelKey: "nav.vision", type: "link" },
  { href: "/#features", labelKey: "nav.features", type: "link" },
  { href: "/#contact", labelKey: "nav.contact", type: "dropdown" },
];

const productLinks = [
  { href: "/#xvi-typoo", labelKey: "products.xviTypoo", logo: "/xviTypooCm.svg", descriptionKey: "products.xviTypooDesc" },
  { href: "/#xvi-get", labelKey: "products.xviGet", logo: "/xviGetCm.svg", descriptionKey: "products.xviGetDesc" },
  { href: "/#kleava", labelKey: "products.kleava", logo: "/kleavaCm.svg", descriptionKey: "products.kleavaDesc" },
];

const contactLinks = [
  { href: "mailto:contact@xvifloo.com", label: "contact@xvifloo.com", Icon: Mail },
  { href: "https://x.com/xvifloo", label: "@xvifloo", Icon: X },
  { href: "https://facebook.com/xvifloo", label: "XviFloo", Icon: Facebook },
];

const roadmapContent = {
  heading: "Ecosystem Evolution Pathway",
  description: "Explore the future of XviFloo's ecosystem development.",
  // Assuming ecosystem-graph.tsx will be integrated here
];

const themeOptions = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: SunMoon },
];

const langOptions = [
  { value: "en", label: "English" },
  { value: "bn", label: "বাংলা" },
];

function HamburgerButton({
  // Hamburger button component remains the same, but its styling will be updated in globals.css
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="hamburger-button"
      aria-label="Toggle menu"
      aria-expanded={isOpen}
      onClick={onClick}
    >
      <span className={cn("line top", { open: isOpen })} />
      <span className={cn("line middle", { open: isOpen })} />
      <span className={cn("line bottom", { open: isOpen })} />
    </button>
  );
}

export function Navbar() {
  const pathname = usePathname(); // Get current path for active link highlighting
  const { dict } = useI18n();
  // i18n-provider এর current API অনুযায়ী lang update করা যাচ্ছে না।
  // এখানে শুধু UI রেন্ডারের জন্য static value রাখা হচ্ছে।
  const lang = "en" as "en" | "bn";

  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);


  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  // setLang is not implemented as lang update is not possible with the current i18n-provider API.




  const NavLink = ({
    href,
    labelKey,
  }: {
    href: string;
    labelKey: string;
  }) => {
    const isActive = pathname === href;
    const label = labelKey.split(".").reduce((o: unknown, k: string) => {
      if (o && typeof o === "object" && k in (o as Record<string, unknown>)) {
        return (o as Record<string, unknown>)[k];
      }
      return undefined;
    }, dict as unknown) as string;


    const handleMouseEnter = (type: string) => {
      if (window.innerWidth >= 1024) { // Only for desktop
        setActiveDropdown(type);
      }
    };

    const handleMouseLeave = () => {
      if (window.innerWidth >= 1024) { // Only for desktop
        setActiveDropdown(null);
      }
    };

    const handleClick = (type: string) => {
      if (window.innerWidth < 1024) { // Only for mobile
        if (type === "link") {
          setIsMenuOpen(false);
        } else {
          setActiveDropdown(activeDropdown === labelKey ? null : labelKey);
        }
      } else if (type === "link") {
        setIsMenuOpen(false);
      }
    };

    const isDropdownOpen = activeDropdown === labelKey;

    return (
      <div
        className={cn("nav-item", { "has-dropdown": type === "dropdown" })}
        onMouseEnter={() => handleMouseEnter(labelKey)}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href={href}
          className={cn("nav-link", { active: isActive, "dropdown-active": isDropdownOpen })}
          onClick={() => handleClick(type)}
        >
          {label}
          {type === "dropdown" && <ChevronDown className={cn("size-3.5 transition-transform", { "rotate-180": isDropdownOpen })} />}
        </Link>

        {type === "dropdown" && isDropdownOpen && (
          <div className="dropdown-panel">
            {labelKey === "nav.products" && (
              <div className="product-dropdown-content">
                {productLinks.map((product) => (
                  <Link
                    key={product.href}
                    href={product.href}
                    className="product-dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Image src={product.logo} alt={product.labelKey} width={40} height={40} />
                    <div className="product-info">
                      <span className="product-title">{product.labelKey.split(".").reduce((o: unknown, k: string) => {
                        if (o && typeof o === "object" && k in (o as Record<string, unknown>)) {
                          return (o as Record<string, unknown>)[k];
                        }
                        return undefined;
                      }, dict as unknown) as string}</span>
                      <p className="product-description">
                        {product.descriptionKey.split(".").reduce((o: unknown, k: string) => {
                          if (o && typeof o === "object" && k in (o as Record<string, unknown>)) {
                            return (o as Record<string, unknown>)[k];
                          }
                          return undefined;
                        }, dict as unknown) as string}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {labelKey === "nav.roadmap" && (
              <div className="roadmap-dropdown-content">
                <h3 className="roadmap-heading">{roadmapContent.heading}</h3>
                <p className="roadmap-description">{roadmapContent.description}</p>
                {/* Placeholder for Ecosystem Evolution Pathway topology */}
                <div className="roadmap-topology-placeholder">
                  {/* This is where ecosystem-graph.tsx content would go */}
                  <Map className="size-16 text-primary" />
                  <p>Ecosystem Topology Visualization</p>
                </div>
              </div>
            )}
            {labelKey === "nav.contact" && (
              <div className="contact-dropdown-content">
                {contactLinks.map((contact) => (
                  <Link
                    key={contact.href}
                    href={contact.href}
                    className="contact-dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <contact.Icon className="size-4" />
                    <span>{contact.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={cn("navbar-capsule", { "menu-open": isMenuOpen })}>
      <div className="navbar-content">
        <div className="navbar-left">
          <Link href="/" className="shrink-0 hidden lg:block" onClick={() => setIsMenuOpen(false)}>
            <Image
              src="/xviFlooCm.svg"
              alt="XviFloo Logo"
              width={120} // Adjust size as needed
              height={30} // Adjust size as needed
              priority
            />
            <span className="sr-only">XviFloo Home</span>
          </Link>
          <Link href="/" className="shrink-0 lg:hidden" onClick={() => setIsMenuOpen(false)}>
            <Image
              src="/xviFlooPm.svg"
              alt="XviFloo Logo Mobile"
              width={40} // Adjust size as needed
              height={40} // Adjust size as needed
              priority
            />
            <span className="sr-only">XviFloo Home</span>
          </Link>
        </div>

        <div className="navbar-center">
          {navLinks.map((link) => {
            const label = link.labelKey.split(".").reduce((o: unknown, k: string) => {
              if (o && typeof o === "object" && k in (o as Record<string, unknown>)) {
                return (o as Record<string, unknown>)[k];
              }
              return undefined;
            }, dict as unknown) as string;

            return (
              <NavLink
                key={link.href}
                href={link.href}
                labelKey={link.labelKey}
                type={link.type as "link" | "dropdown"}
              />
            );
          })}
        </div>

        <div className="navbar-right">
          <div className="hidden items-center gap-2 lg:flex">
            {/* Theme Selector */}
            <div className="theme-selector">
              <Sun className="size-3.5" /> {/* Default icon, will change based on theme */}
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                aria-label="Select theme"
              >
                {themeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="size-3.5 opacity-50" />
            </div>

            {/* Language Selector */}
            <div className="lang-selector">
              <Languages className="size-3.5" />
              <select
                value={lang}
                onChange={(e) => {
                  // setLang(e.target.value as "en" | "bn"); // Disabled due to i18n-provider limitation
                }}
                aria-label="Select language"
              >
                {langOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="size-3.5 opacity-50" />
            </div>
          </div>

          <div className="h-6 w-px bg-white/10" />

          <Link href="/login" className="sign-in-button" onClick={() => setIsMenuOpen(false)}>
            <LogIn className="size-3.5" />
            <span>{dict.nav.signIn}</span>
          </Link>
        </div>

        <div className="navbar-mobile-toggle">
          <HamburgerButton isOpen={isMenuOpen} onClick={toggleMenu} />
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div className="mobile-menu-panel lg:hidden">
        <div className="mobile-menu-content">
          <div className="mobile-nav-links">
            {navLinks.map((link) => {
              const label = link.labelKey.split(".").reduce((o: unknown, k: string) => {
                if (o && typeof o === "object" && k in (o as Record<string, unknown>)) {
                  return (o as Record<string, unknown>)[k];
                }
                return undefined;
              }, dict as unknown) as string;

              return (
                <div key={link.href} className="mobile-nav-item">
                  <NavLink
                    href={link.href}
                    labelKey={link.labelKey}
                    type={link.type as "link" | "dropdown"}
                  />
                </div>
              );
            })}
          </div>

          <div className="mobile-menu-separator" />

          {/* Theme Selection for Mobile */}
          <div className="mobile-menu-section">
            <p className="mobile-menu-heading">{(dict.nav as { theme?: string }).theme ?? "Theme"}</p>
            <div className="mobile-menu-options">
              {themeOptions.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  className={cn("mobile-menu-option", { active: theme === value })}
                  onClick={() => {
                    setTheme(value);
                    setIsMenuOpen(false);
                  }}
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selection for Mobile */}
          <div className="mobile-menu-section">
            <p className="mobile-menu-heading">{(dict.nav as { language?: string }).language ?? "Language"}</p>
            <div className="mobile-menu-options">
              {langOptions.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={cn("mobile-menu-option", { active: lang === value })}
                  onClick={() => {
                    // lang update current i18n-provider দিয়ে সম্ভব না
                    setIsMenuOpen(false);
                  }}
                >
                  <Languages className="size-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sign In Button for Mobile */}
          <div className="mobile-menu-section">
            <Link href="/login" className="sign-in-button mobile-sign-in-button" onClick={() => setIsMenuOpen(false)}>
              <LogIn className="size-4" />
              <span>{dict.nav.signIn}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
          ))}
        </div>

        <div className="navbar-right">
          <div className="hidden items-center gap-2 lg:flex">
            <div className="theme-selector">
              <Sun className="size-3.5" />
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                aria-label="Select theme"
              >
                {themeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="size-3.5 opacity-50" />
            </div>

            <div className="lang-selector">
              <Languages className="size-3.5" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as "en" | "bn")}
                aria-label="Select language"
              >
                {langOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="size-3.5 opacity-50" />
            </div>
          </div>

          <div className="h-6 w-px bg-white/10" />

          <Link href="/login" className="sign-in-button">
            <LogIn className="size-3.5" />
            <span>{dict.nav.signIn}</span>
          </Link>
        </div>

        <div className="navbar-mobile-toggle">
          <HamburgerButton isOpen={isMenuOpen} onClick={toggleMenu} />
        </div>
      </div>

      <div className="mobile-menu-panel">
        <div className="mobile-menu-content">
          <div className="mobile-nav-links">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
          </div>

          <div className="mobile-menu-separator" />

          <div className="mobile-menu-section">
            <p className="mobile-menu-heading">{(dict.nav as { theme?: string }).theme ?? "Theme"}</p>


            <div className="mobile-menu-options">
              {themeOptions.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  className={cn("mobile-menu-option", { active: theme === value })}
                  onClick={() => {
                    setTheme(value);
                    setIsMenuOpen(false);
                  }}
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mobile-menu-section">
            <p className="mobile-menu-heading">{(dict.nav as { language?: string }).language ?? "Language"}</p>


            <div className="mobile-menu-options">
              {langOptions.map(({ value, label }) => (

                <button
                  key={value}
                  type="button"
                  className={cn("mobile-menu-option", { active: lang === value })}
                onClick={() => {
                    // lang update current i18n-provider দিয়ে সম্ভব না
                    setIsMenuOpen(false);
                  }}

                >
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
