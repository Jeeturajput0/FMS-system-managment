import React from "react";
import { PortalSectionPage } from "../../portal/components/PortalSectionPage";
export const StudentCourses = () => <PortalSectionPage title="My Course" description="Browse your assigned learning content." type="courses" />;
export const StudentFees = () => <PortalSectionPage title="My Fees" description="Review your fee balance and payment history." type="fees" />;
export const StudentProfile = () => <PortalSectionPage title="My Profile" description="Your account profile and portal access details." type="students" />;
export const StudentPlaceholder = ({ title }) => <PortalSectionPage title={title} description="This module is ready for your role account." type="courses" />;
