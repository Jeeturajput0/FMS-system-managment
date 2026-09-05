import React from "react";
import { PortalSectionPage } from "../../portal/components/PortalSectionPage";
export const TeacherCourses = () => <PortalSectionPage title="My Courses" description="See the courses assigned to your teaching account." type="courses" />;
export const TeacherStudents = () => <PortalSectionPage title="My Students" description="Review the students connected to your teaching workspace." type="students" />;
export const TeacherPlaceholder = ({ title }) => <PortalSectionPage title={title} description="Manage this teaching module from your role workspace." type="students" actionLabel={title.includes("Create") ? title : undefined} />;
