import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Image from 'next/image';
import Link from 'next/link';
import { Blog } from '../../store/src/lib/blog/types';
import styles from "../../components/css/file1.module.css"; // Import the CSS module
import Navbar from '@/components/nav'; // Updated Navbar import
import Footer from '@/components/footar';
import clsx from 'clsx';

interface BlogListProps {
  blogs: Blog[];
}

const BlogList: React.FC<BlogListProps> = ({ blogs }) => {
  return (
    <>
      <Navbar />
      <div className="flex justify-center bg-black w-full">
        <div className={`${styles["semi-container9"]} px-4 lg:px-8`}>
          <h1 className="text-white text-center text-6xl font-bold my-8">Blogs</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-9">
            {blogs.map((blog) => (
            <div
            key={blog.uid}
            className={clsx(
              "bg-gray-900 p-6 rounded-lg", // Background, padding, and rounded corners
              "border-4", // Border width
              "border-transparent", // Initial transparent border
              "hover:border-[#5f20ff]", // Border color on hover
              "animate-pulse-border-shadow-green", // Custom animation for pulsing border shadow
              "flex flex-col justify-center" // Flexbox layout to center content
            )}
          >
                <Link href={`/blogs/${blog.uid}`}>
                  <div >
                    <Image
                      src={blog.thumbnail}
                      alt={blog.title}
                      width={350} // Replace with appropriate dimensions
                      height={250} 
                      className="rounded-md mb-4 mx-auto"
                    />
                    {/* Blog Title */}
                    <h2 className="text-white text-2xl font-semibold mb-2">
                      {blog.title}
                    </h2>
                  </div>
                </Link>
                {/* Metadata Section */}
                <div className="text-gray-400 text-sm mb-4">
                  <p>
                    <span className="font-semibold text-gray-300">Author:</span> {blog.author}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">Published:</span> {blog.created}
                  </p>
                </div>
                {/* Blog Description */}
                <p className="text-gray-300 mb-1">{blog.description}</p>
                {/* Read More Link */}
                <Link
                  href={`/blogs/${blog.uid}`}
                  className="text-blue-500 hover:underline"
                >
                  Read more...
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const blogsDirectory = path.join(process.cwd(), 'src/blogs');
  const filenames = fs.readdirSync(blogsDirectory);

  const blogs = filenames.map((filename) => {
    const filePath = path.join(blogsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    // Ensure modified exists and fallback to created if not present
    const modifiedDate = data.modified || data.created;

    return {
      ...data,
      uid: filename.replace(/\.mdx$/, ''),
      modified: modifiedDate, // Assign a value for modified
    };
  });

  // Sort blogs by the 'modified' date (newest first)
  blogs.sort((a, b) => {
    const dateA = new Date(a.modified);
    const dateB = new Date(b.modified);
    return dateB.getTime() - dateA.getTime();
  });

  return {
    props: {
      blogs,
    },
  };
};

export default BlogList;
