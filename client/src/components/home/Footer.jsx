export default function Footer() {
    return (
        <>
            <footer id="contact" className="flex flex-col md:flex-row gap-3 items-center justify-around w-full py-4 text-sm bg-green-400 text-white mt-28">
            <p className="hover:text-green-800"> 
                <a href="https://github.com/blank-16" target="blank">@Blank-16</a>
            </p>
                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-green-800 transition-all">
                        Contact Us
                    </a>
                    <div className="h-8 w-px bg-white/20"></div>
                    <a href="#" className="hover:text-green-800 transition-all">
                        Privacy Policy
                    </a>
                    <div className="h-8 w-px bg-white/20"></div>
                    <a href="#" className="hover:text-green-800 transition-all">
                        Trademark Policy
                    </a>
                </div>
            </footer>
        </>
    );
};