"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { getProjectModalData } from "@/app/data/projectsModal.server";
import { technologiesList } from "@/app/data/technologies.server";
import { useTranslation } from "../hooks/useTranslation";
import IconWithText from "./IconWithText";

const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 20,
        transition: { duration: 0.2, ease: "easeIn" }
    },
};

export const ProjectModal = ({ project, isOpen, onClose }) => {
    const { t } = useTranslation();
    const [activeImage, setActiveImage] = useState(0);

    if (!project) return null;

    const modalData = getProjectModalData(project.slug);
    if (!modalData) return null;

    const getTechDetails = (code) => {
        return technologiesList.find((tech) => tech.code === code);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    variants={overlayVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                    onKeyDown={handleKeyDown}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <motion.div
                        className="card bg-base-100 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="card-body p-6 md:p-8">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <h2 id="modal-title" className="card-title text-xl md:text-2xl font-heading">
                                    {t(project.nameKey)}
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="btn btn-ghost btn-sm btn-circle"
                                    aria-label={t("projects.modal.close")}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Image carousel */}
                            <div className="mb-6">
                                <div className="relative rounded-lg overflow-hidden bg-base-200 aspect-video">
                                    <Image
                                        src={modalData.images[activeImage]}
                                        alt={`${t(project.nameKey)} screenshot ${activeImage + 1}`}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                {modalData.images.length > 1 && (
                                    <div className="flex justify-center gap-2 mt-3">
                                        {modalData.images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveImage(idx)}
                                                className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === activeImage ? "bg-primary" : "bg-base-300"
                                                    }`}
                                                aria-label={`View image ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {t(project.descriptionKey)}
                            </p>

                            {/* Technologies section */}
                            <div className="mb-6">
                                <h3 className="font-medium text-base-content mb-3">
                                    {t("projects.modal.technologies")}
                                </h3>
                                <div className="space-y-3">
                                    {modalData.technologies.map((tech, idx) => {
                                        const techDetails = getTechDetails(tech.code);
                                        return (
                                            <div key={idx} className="flex items-center gap-3 bg-base-200/50 rounded-lg p-3">
                                                <IconWithText value={tech.code} type="technology" showText={false} />
                                                <div>
                                                    <p className="font-medium text-sm" style={{ color: techDetails?.color }}>
                                                        {techDetails?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{tech.role}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Impact metrics */}
                            {modalData.impact && modalData.impact.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="font-medium text-base-content mb-3">
                                        {t("projects.modal.impact")}
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {modalData.impact.map((metric, idx) => (
                                            <div key={idx} className="text-center p-4 bg-base-200/50 rounded-lg">
                                                <p className="text-2xl font-bold text-primary">{metric.value}</p>
                                                <p className="text-xs text-gray-500 mt-1">{t(metric.labelKey)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Footer actions */}
                            <div className="card-actions justify-end">
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                    >
                                        {t("projects.access")}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                        </svg>
                                    </a>
                                )}
                                <button onClick={onClose} className="btn btn-ghost">
                                    {t("projects.modal.close")}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;
