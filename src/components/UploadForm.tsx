import React, { useState } from 'react';
import { uploadProject } from '../utils/api';

const getVimeoEmbedUrl = (link: string) => {
  if (!link) return '';
  // match numeric id from vimeo links (vimeo.com/123456789 or player.vimeo.com/video/123456789)
  const m = link.match(/(?:vimeo\.com\/(?:.*#|.*?\/videos\/)?|player\.vimeo\.com\/video\/)(\d+)/);
  const id = m ? m[1] : null;
  return id ? `https://player.vimeo.com/video/${id}` : link;
};

const UploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState(''); // new input
  const [category, setCategory] = useState('All Projects');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // require title and either thumbnail or videoLink
    if (!title || (!thumbnail && !videoLink)) {
      setError('Provide a title and either a thumbnail or a video link.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    if (thumbnail) formData.append('thumbnail', thumbnail);

    if (videoLink) {
      const embed = getVimeoEmbedUrl(videoLink);
      formData.append('videoUrl', embed); // backend should save this as the project's video URL
      formData.append('originalVideoLink', videoLink); // keep original for reference
    }

    try {
      await uploadProject(formData);
      setSuccess('Project uploaded successfully!');
      setTitle('');
      setDescription('');
      setThumbnail(null);
      setVideoLink('');
      setCategory('All Projects');
    } catch (err) {
      setError('Failed to upload project. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <input
        type="text"
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />

      <textarea
        placeholder="Project Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setThumbnail(e.target.files[0]);
          }
        }}
        className="p-2 border border-gray-300 rounded"
      />

      <input
        type="url"
        placeholder="Vimeo link (optional) — e.g. https://vimeo.com/123456789"
        value={videoLink}
        onChange={(e) => setVideoLink(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      >
        <option value="All Projects">All Projects</option>
        <option value="Selected Work">Selected Work</option>
        <option value="Narrative">Narrative</option>
        <option value="Music Videos">Music Videos</option>
        <option value="Commercials">Commercials</option>
        <option value="Format Agnostic">Format Agnostic</option>
      </select>

      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Upload Project
      </button>
    </form>
  );
};

export default UploadForm;