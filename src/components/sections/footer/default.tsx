import { ModeToggle } from "../../ui/mode-toggle";
import { Footer, FooterBottom } from "../../ui/footer";

export default function FooterSection() {
  return (
    <footer className="w-full bg-background px-4">
      <div className="mx-auto container">
        <Footer>
          <FooterBottom>
            <div>© 2025 All rights reserved · @viktrix8, @ovosk</div>
            <div>
              Stránka je v beta verzii, nápady a chyby nam posielajte na
              discord.
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
