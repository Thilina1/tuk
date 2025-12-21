'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '@/config/firebase';
import Link from 'next/link';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import AdminLayout from "../../components/AdminLayout";


interface Blog {
  id: string;
  title: string;
  featured: boolean;
  featuredPosition?: number;
  contentImage?: string;
}

export default function BlogsPage() {
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [nonFeaturedBlogs, setNonFeaturedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'blogs'), (snapshot) => {
      setLoading(true);
      const blogsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Blog[];
      
      const featured = blogsList
        .filter(blog => blog.featured)
        .sort((a, b) => (a.featuredPosition || 0) - (b.featuredPosition || 0));
      const nonFeatured = blogsList.filter(blog => !blog.featured);

      setFeaturedBlogs(featured);
      setNonFeaturedBlogs(nonFeatured);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string, featured: boolean, position?: number) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      const batch = writeBatch(db);
      const blogRef = doc(db, 'blogs', id);
      batch.delete(blogRef);

      if (featured && typeof position === 'number') {
        featuredBlogs.forEach(blog => {
          if (blog.id !== id && blog.featuredPosition && blog.featuredPosition > position) {
            const otherBlogRef = doc(db, 'blogs', blog.id);
            batch.update(otherBlogRef, { featuredPosition: blog.featuredPosition - 1 });
          }
        });
      }
      await batch.commit();
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList = source.droppableId === 'featured-blogs' ? [...featuredBlogs] : [...nonFeaturedBlogs];
    const destList = destination.droppableId === 'featured-blogs' ? [...featuredBlogs] : [...nonFeaturedBlogs];
    
    const [movedItem] = sourceList.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceList.splice(destination.index, 0, movedItem);
      if (source.droppableId === 'featured-blogs') {
        setFeaturedBlogs(sourceList);
        const batch = writeBatch(db);
        sourceList.forEach((blog, index) => {
          const blogRef = doc(db, 'blogs', blog.id);
          batch.update(blogRef, { featuredPosition: index + 1 });
        });
        await batch.commit();
      } else {
        setNonFeaturedBlogs(sourceList);
      }
    } else {
      movedItem.featured = destination.droppableId === 'featured-blogs';
      destList.splice(destination.index, 0, movedItem);

      setFeaturedBlogs(destination.droppableId === 'featured-blogs' ? destList : sourceList);
      setNonFeaturedBlogs(destination.droppableId === 'non-featured-blogs' ? destList : sourceList);

      const batch = writeBatch(db);
      const finalFeatured = destination.droppableId === 'featured-blogs' ? destList : sourceList;
      const finalNonFeatured = destination.droppableId === 'non-featured-blogs' ? destList : sourceList;

      finalFeatured.forEach((blog, index) => {
        const blogRef = doc(db, 'blogs', blog.id);
        batch.update(blogRef, { featured: true, featuredPosition: index + 1 });
      });

      finalNonFeatured.forEach(blog => {
        const blogRef = doc(db, 'blogs', blog.id);
        batch.update(blogRef, { featured: false, featuredPosition: null });
      });

      await batch.commit();
    }
  };

  const renderBlogList = (blogs: Blog[], droppableId: string) => (
    <div className="bg-white p-6 rounded-xl shadow-md min-h-[200px]">
        <h2 className="text-2xl font-bold mb-6 capitalize text-gray-800">{droppableId.replace('-',' ')}</h2>
        <Droppable droppableId={droppableId}>
            {(provided, snapshot) => (
                <ul 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                    className={`space-y-4 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''} rounded-lg p-2`}>
                    {blogs.map((blog, index) => (
                        <Draggable key={blog.id} draggableId={blog.id} index={index}>
                            {(provided) => (
                                <li
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="p-4 border border-gray-200 rounded-lg flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex items-center">
                                        {blog.contentImage ? (
                                            <img src={blog.contentImage} alt={blog.title} className="w-16 h-16 object-cover mr-4 rounded-md" />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-100 mr-4 rounded-md flex items-center justify-center">
                                                <span className="text-xs text-gray-400">No Image</span>
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-semibold text-gray-900">{blog.title}</span>
                                            {blog.featured && blog.featuredPosition && (
                                                <span className="ml-2 text-sm text-gray-500">(Position: {blog.featuredPosition})</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Link href={`/Admin/pages/blogs/edit/${blog.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                                            <FiEdit size={20} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(blog.id, blog.featured, blog.featuredPosition)}
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                        >
                                            <FiTrash2 size={20} />
                                        </button>
                                    </div>
                                </li>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </ul>
            )}
        </Droppable>
    </div>
);


  return (
    <AdminLayout>
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Manage Blogs</h1>
        <Link href="/Admin/pages/blogs/create" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200">
          Create New Blog
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderBlogList(featuredBlogs, 'featured-blogs')}
            {renderBlogList(nonFeaturedBlogs, 'non-featured-blogs')}
          </div>
        </DragDropContext>
      )}
    </div>
    </AdminLayout>
  );
}
