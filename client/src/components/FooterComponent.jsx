import { Footer } from "flowbite-react";
import React from "react";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import {
  BsFacebook,
  BsGoogle,
  BsInstagram,
  BsLine,
  BsTelegram,
  BsTwitter,
} from "react-icons/bs";

export default function FooterComponent() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          <div className="mt-5">
            {/* icon */}
            <div
              className="self-center whitespace-nowrap text-lg
             dark:text-white sm:text-xl font-semibold"
            >
              <span
                className="px-2 py-1 bg-gradient-to-r from-indigo-500
            via-purple-500 to-pink-500 rounded-lg text-white"
              >
                DVN
              </span>
              Blog
            </div>
          </div>
          <div className="grid grid-cols-2 mt-3 gap-6 sm:mt-4 sm:grid-cols-3 sm:gap-6">
            {/* about */}
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.100jsprojects.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  100 JS Projects
                </Footer.Link>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DVN Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            {/* follow us */}
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/vngduy1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center gap-2">
                    Github <FaGithub />
                  </div>
                </Footer.Link>
                <Footer.Link
                  href="https://www.facebook.com/akira.hanatsuki/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center gap-2">
                    Facebook <FaFacebook />
                  </div>
                </Footer.Link>
                <Footer.Link
                  href="https://mail.google.com/mail/u/0/#inbox"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center gap-2">
                    Gmail <MdEmail />
                  </div>
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            {/* legal */}
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms & Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Dvn Blog"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-3 sm:mt-2 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon href="#" icon={BsTelegram} />
            <Footer.Icon href="#" icon={BsGoogle} />
            <Footer.Icon href="#" icon={BsLine} />
          </div>
        </div>
      </div>
    </Footer>
  );
}
