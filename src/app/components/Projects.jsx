"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { projectsData } from "@/app/lib/projects-data";
import { extensionsData } from "@/app/lib/extensions-data";
import { formatDate } from "@/app/lib/date";
import IconWithText from "@/app/components/IconWithText";
import ProjectModal from "@/app/components/ProjectModal";
import Image from "next/image";
import { useTranslation } from "../hooks/useTranslation";
import {
  floatingVariant,
  floatingFastVariant,
  floatingSlowVariant,
  fadeInVariant,
  staggerContainerVariant,
  staggerItemVariant,
  cardHoverVariant,
  buttonHoverVariant
} from "@/app/utils/animationConfig";

const parseDownloads = (value) => {
  if (!value) return 0;
  const cleaned = value.replace(/\./g, "").replace(/\D/g, "");
  return parseInt(cleaned, 10) || 0;
};

export const Projects = ({ type = "projects" }) => {
  const { t, currentLanguage } = useTranslation();
  const data = type === "extensions" ? extensionsData : projectsData;
  const projects = data[currentLanguage]?.[type === "extensions" ? "extensions" : "projects"] || data.pt[type === "extensions" ? "extensions" : "projects"];
  const [selectedProject, setSelectedProject] = useState(null);

  const mostDownloaded =
    type === "extensions"
      ? [...projects].reduce((max, ext) =>
          parseDownloads(ext.downloads) > parseDownloads(max?.downloads) ? ext : max
        )
      : null;

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <motion.section
        id={type}
        className="mx-auto max-w-4xl w-full mt-10 mb-10 relative px-6"
        variants={fadeInVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {type !== "extensions" && (
          <div className="absolute -left-20 top-0 h-full w-full pointer-events-none hidden lg:block">
            <motion.img
              alt=""
              src="/circle1.svg"
              className="absolute top-32 -left-16 glass-ornament"
              width="90"
              height="90"
              variants={floatingFastVariant}
              animate="float"
            />
            <motion.img
              alt=""
              src="/circle3.svg"
              className="absolute top-16 -right-20 glass-ornament"
              width="140"
              height="140"
              variants={floatingSlowVariant}
              animate="float"
            />
            <motion.img
              alt=""
              src="/circle2.svg"
              className="absolute top-96 -left-28 glass-ornament"
              width="160"
              height="160"
              variants={floatingVariant}
              animate="float"
            />
            <motion.img
              alt=""
              src="/circle1.svg"
              className="absolute bottom-20 -right-12 glass-ornament"
              width="70"
              height="70"
              variants={floatingFastVariant}
              animate="float"
            />
          </div>
        )}

        <div className="flex flex-col justify-center items-center relative z-10">
          {type !== "extensions" && (
            <h2 className="text-2xl md:text-3xl font-medium leading-7 text-center my-10 text-base-content tracking-tight font-heading">
              {t(`${type}.title`)}
            </h2>
          )}

          <motion.div
            className="flex flex-col items-center w-full space-y-6"
            variants={staggerContainerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {(type === "extensions" ? [...projects].reverse() : projects).map((project) => (
              <motion.div
                key={project.id}
                className="w-full"
                variants={staggerItemVariant}
              >
                <motion.div
                  className="card card-side bg-base-100/70 backdrop-blur-sm shadow-md border border-base-300/50 overflow-hidden"
                  variants={cardHoverVariant}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  >
                    <figure className="w-20 md:w-24 flex-shrink-0 bg-base-200/50 p-3 flex items-center justify-center">
                    <Image
                      src={project.image || project.icon}
                      alt={`${project.name} logo`}
                      className="object-contain rounded-lg"
                      width={56}
                      height={56}
                    />
                  </figure>

                  <div className="card-body p-4 md:p-5">
                    <h3 className="card-title text-lg font-heading text-base-content">
                      {project.name}
                    </h3>

                    {type !== "extensions" && (
                      <div className="flex flex-wrap gap-1.5 my-1">
                        {project.frameworks.map((framework, fIndex) => (
                          <div
                            key={fIndex}
                            className="badge badge-sm badge-ghost gap-1 px-2 py-2.5"
                          >
                            <IconWithText value={framework} type="technology" showText={false} showTooltip />
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-sm text-secondary leading-relaxed font-light line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted mt-2 flex-wrap">
                      {mostDownloaded && project.slug === mostDownloaded.slug && (
                        <span className="badge badge-xs badge-primary">
                          {t("extensions.mostDownloaded")}
                        </span>
                      )}
                      {project.downloads && (
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          {project.downloads} {t("extensions.downloads")}
                        </span>
                      )}
                      {project.releaseDate && (
                        <span>
                          {t("extensions.releaseDate")} {formatDate(project.releaseDate, currentLanguage)}
                        </span>
                      )}
                    </div>

                    <div className="card-actions justify-end mt-3">
                      {project.link && (
                        <motion.a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm"
                          variants={buttonHoverVariant}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                        >
                          {type === "extensions" ? t("extensions.install") : t("projects.access")}
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </motion.a>
                      )}
                      <motion.button
                        onClick={() => openModal(project)}
                        className="btn btn-ghost btn-sm"
                        variants={buttonHoverVariant}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        {type === "extensions" ? t("extensions.moreInfo") : t("projects.details")}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={closeModal}
        type={type}
      />
    </>
  );
};

export default Projects;