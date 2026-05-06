import React from 'react';
import ProjectCard from './ProjectCard';
import { Project } from '../types';
import { getVimeoEmbedUrl } from '../utils/video'; // <- new import

const placeholder = (n: number) => `https://via.placeholder.com/1200x675?text=Project+${n}`;

const placeholderProjects: Project[] = [
  {
    id: 'p1',
    title: "Trujistas 'It's A Lifestyle'",
    description: '',
    thumbnail: 'trujistas.jpg',
    link: 'https://vimeo.com/1185046543?share=copy&fl=sv&fe=ci',
    category: 'Selected Work',
    role: 'DIRECTOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    // @ts-ignore
    credits: [
      { role: 'Director', name: 'Miguel Verduzco' },
      { role: 'DP', name: 'Luke Im' },
      { role: 'Editor', name: 'Miguel Verduzco' },
    ],
  },
  {
    id: 'p2',
    title: "StreetMob 'For The People'",
    description: '',
    thumbnail: 'sm_ftp.png',
    link: 'https://vimeo.com/1161596876?share=copy&fl=sv&fe=ci',
    category: 'Commercials',
    role: 'DIRECTOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    credits: [
      { role: 'Director', name: 'Miguel Verduzco' },
      { role: 'Producer', name: 'Nick Villasenor' },
      { role: '1st AD', name: 'Adam Guillén' },
      { role: 'DP', name: 'Luke Im' },
      { role: '1st AC', name: 'Sun Min Park' },
      { role: 'Gaffer', name: 'James Turner' },
      { role: 'Editor', name: 'Miguel Verduzco' },
      { role: 'Model', name: 'Cosmo' },
      { role: 'Model', name: 'Diego Luciano Macias' },
      { role: 'Model', name: 'StreetMob Records Team' },
    ],
  },
  {
    id: 'p3',
    title: "Converse 'Shai 001'",
    description: '',
    thumbnail: 'shai.jpg',
    link: 'https://vimeo.com/1077849739?fl=tl&fe=ec',
    category: 'Commercials',
    role: 'EDITOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    credits: [
      { role: 'Client', name: 'Converse' },
      { role: 'Agency', name: 'Passerine' },
      { role: 'DP', name: '70mm' },
      { role: 'Editor', name: 'Miguel Verduzco' },
    ],
  },
  {
    id: 'p4',
    title: "Microsoft 'Made For You'",
    description: '',
    thumbnail: 'msft2.jpg',
    link: 'https://vimeo.com/942452177/ca2960403d?share=copy&fl=sv&fe=ci',
    category: 'Commercials',
    role: 'EDITOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    credits: [
      { role: 'Client', name: 'Microsoft' },
      { role: 'Agency', name: 'Passerine' },
      { role: 'Editor', name: 'Miguel Verduzco' },
      { role: 'Editor', name: 'Logan Hersh' },
    ],
  },
  {
    id: 'p5',
    title: "Nana 'Friends and Benefits'",
    description: '',
    thumbnail: 'nana.jpg',
    link: 'https://vimeo.com/1125241800?fl=tl&fe=ec',
    category: 'Music Videos',
    role: 'DIRECTOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    credits: [
      { role: 'Director', name: 'Miguel Verduzco' },
      { role: 'Producer', name: 'Justin Trevino' },
      { role: 'Executive Producer', name: 'Niko Oroc' },
      { role: 'DP', name: 'Dustin Sheperd' },
      { role: 'Lighting Tech', name: 'Jacob Magadan' },
      { role: 'Editor', name: 'Miguel Verduzco' },
      { role: 'Colorist', name: 'Eirik Alsaker Sande' },
    ],
  },
  {
    id: 'p6',
    title: "Microsoft 'Billie Jean King 2024'",
    description: '',
    thumbnail: 'billie.jpg',
    link: 'https://vimeo.com/942454260?share=copy&fl=sv&fe=ci',
    category: 'Commercials',
    role: 'EDITOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    credits: [
      { role: 'Client', name: 'Microsoft' },
      { role: 'Agency', name: 'Passerine' },
      { role: 'Editor', name: 'Miguel Verduzco' },
      { role: 'Editor', name: 'Logan Hersh' },
      { role: 'Additional Edits', name: 'David Rho' },
    ],
  },
  {
    id: 'p7',
    title: "OCD Cleaners x Drok",
    description: '',
    thumbnail: 'ocd_drok.jpg',
    link: 'https://vimeo.com/1156659589?share=copy&fl=sv&fe=ci',
    category: 'Commercials',
    role: 'DIRECTOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    credits: [
      { role: 'Director', name: 'Miguel Verduzco' },
      { role: 'DP', name: 'Luke Im' },
      { role: 'Editor', name: 'Corey Brown' },
    ],
  },
  {
    id: 'p8',
    title: "DOGTAG 'Short Film'",
    description: '',
    thumbnail: 'dogtag.jpg',
    link: 'https://vimeo.com/1125242877?share=copy&fl=sv&fe=ci',
    category: 'Narrative',
    role: 'DIRECTOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    credits: [
      { role: 'Director', name: 'Miguel Verduzco' },
      { role: 'Director', name: 'Tom Vouga' },
      { role: 'Editor', name: 'Miguel Verduzco' },
      { role: 'Editor', name: 'Tom Vouga' },
    ],
  },
  {
    id: 'p9',
    title: "eBay 'Wins'",
    description: '',
    thumbnail: 'ebay.jpg',
    link: 'https://vimeo.com/807654697?share=copy&fl=sv&fe=ci',
    category: 'Commercials',
    role: 'EDITOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    credits: [
      { role: 'Client', name: 'Microsoft' },
      { role: 'Agency', name: 'Passerine' },
      { role: 'Editor', name: 'Miguel Verduzco' },
    ],
  },
  {
    id: 'p10',
    title: "Pick A Card 'Short Film'",
    description: '',
    thumbnail: 'pickacard.jpg',
    link: 'https://vimeo.com/1189827469?share=copy&fl=sv&fe=ci',
    category: 'Narrative',
    role: 'DIRECTOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    credits: [
      { role: 'Director', name: 'Miguel Verduzco' },
    ],
  },
  {
    id: 'p11',
    title: "Mastercard 'Arnold Palmer Invitational'",
    description: '',
    thumbnail: 'mc.jpg',
    link: 'https://vimeo.com/1189830439?share=copy&fl=sv&fe=ci',
    category: 'Commercials',
    role: 'EDITOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    credits: [
      { role: 'Client', name: 'Mastercard' },
      { role: 'Agency', name: 'Passerine' },
      { role: 'Editor', name: 'Miguel Verduzco' },
    ],
  },
  {
    id: 'p12',
    title: "Don't Cry 'Short Film'",
    description: '',
    thumbnail: 'dontcry.jpg',
    link: 'https://vimeo.com/1189837192?share=copy&fl=sv&fe=ci',
    category: 'Narrative',
    role: 'EDITOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    credits: [
      { role: 'Editor', name: 'Miguel Verduzco' },
    ],
  },
  {
    id: 'p13',
    title: "Josef Lamercier 'Chain Smoke'",
    description: '',
    thumbnail: 'chain.jpg',
    link: 'https://vimeo.com/1189867655?share=copy&fl=sv&fe=ci',
    category: 'Music Videos',
    role: 'DIRECTOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    credits: [
      { role: 'Editor', name: 'Miguel Verduzco' },
    ],
  },
  {
    id: 'p14',
    title: "Microsoft x King Center 'Podcast'",
    description: '',
    thumbnail: 'copilot.jpg',
    link: 'https://vimeo.com/1189884222?share=copy&fl=sv&fe=ci',
    category: 'Commercials',
    role: 'EDITOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    credits: [
      { role: 'Client', name: 'Microsoft' },
      { role: 'Client', name: 'King Center' },
      { role: 'Agency', name: 'Passerine' },
      { role: 'Editor', name: 'Miguel Verduzco' },
    ],
  },
  {
    id: 'p15',
    title: "Sæyki 'Ghana Baby'",
    description: '',
    thumbnail: 'ghana.jpg',
    link: 'https://vimeo.com/1189866640?share=copy&fl=sv&fe=ci',
    category: 'Music Videos',
    role: 'DIRECTOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    credits: [
      { role: 'Director', name: 'Miguel Verduzco' },
      { role: 'Editor', name: 'Miguel Verduzco' },

    ],
  },
  {
    id: 'p16',
    title: "AZLOVEACE 'Yo Te Quiero Ser'",
    description: '',
    thumbnail: 'az.jpg',
    link: 'https://vimeo.com/1157011942?share=copy&fl=sv&fe=ci',
    category: 'Music Videos',
    role: 'DIRECTOR',
    createdAt: new Date(),
    updatedAt: new Date(),
    credits: [
      { role: 'Director', name: 'Miguel Verduzco' },
      { role: 'Editor', name: 'Miguel Verduzco' },
      { role: 'BTS', name: 'Salvador Diaz' },
      { role: 'VFX', name: 'Matteo' },
      { role: 'Color', name: 'Jonathan Murillo' },
      { role: 'Label', name: 'United Masters' },
    ],
  },
];

interface ProjectListProps {
  selectedCategory?: string;
  selectedRole?: string | null;
}

const ProjectList: React.FC<ProjectListProps> = ({ selectedCategory = 'All Projects', selectedRole = null }) => {
  const normalizedProjects: Project[] = placeholderProjects.map(p => ({
    ...p,
    // ensure we preserve hash in embed-ready URL
    // @ts-ignore allow adding videoUrl if not declared in Project type
    videoUrl: getVimeoEmbedUrl(p.link),
  }));

  const byCategory = selectedCategory === 'All Projects'
    ? normalizedProjects
    : normalizedProjects.filter(p => p.category === selectedCategory);

  return (
    <section className="project-grid">
      {byCategory.map((project, index) => {
        const nonMatchRole = selectedRole && project.role !== selectedRole;
        return (
          <div
            className={`project-card ${nonMatchRole ? 'fade-nonmatch' : ''}`}
            key={project.id}
          >
            <ProjectCard project={project as Project} index={index} />
          </div>
        );
      })}
    </section>
  );
};

export default ProjectList;