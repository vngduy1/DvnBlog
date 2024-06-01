import React from "react";

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div className="">
          <h1 className="text-3xl font-semibold text-center my-7">
            About DVN Blog
          </h1>
          <div className="flex flex-col gap-6">
            <p>
              Welcome to DVN, your go-to destination for insightful, engaging,
              and thought-provoking content. At DVN, we believe in the power of
              words to inspire, inform, and connect people from all walks of
              life. Whether you're seeking the latest trends, in-depth analyses,
              or simply a moment of inspiration, DVN has something for everyone.
            </p>
            <h2 className="text-2xl font-semibold">What We Offer</h2>
            <div>
              At DVN, our mission is to provide high-quality content across a
              wide range of topics, including:
              <ul>
                Lifestyle: Tips and tricks for a healthier, happier, and more
                balanced life.
                <li>
                  Technology: The latest updates and reviews on gadgets,
                  software, and innovations.
                </li>
                <li>
                  Travel: Destination guides, travel tips, and personal stories
                  from around the globe.
                </li>
                <li>
                  Culture: Insights into art, music, literature, and the diverse
                  world around us.
                </li>
                <li>
                  Personal Development: Advice on growth, productivity, and
                  achieving your goals.
                </li>
              </ul>
            </div>
            <h2 className="text-2xl font-semibold">Our Team</h2>
            <p>
              Our team of dedicated writers and contributors is passionate about
              sharing their knowledge and experiences with you. Each member
              brings a unique perspective and expertise, ensuring that our
              content is both informative and relatable.
            </p>
            <h2 className="text-2xl font-semibold">Join the Conversation</h2>
            <p>
              We invite you to join our community by subscribing to our
              newsletter, following us on social media, and engaging with our
              posts. Your feedback and participation are what make DVN a vibrant
              and dynamic platform. Thank you for visiting DVN. We look forward
              to embarking on this journey of discovery and inspiration with
              you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
