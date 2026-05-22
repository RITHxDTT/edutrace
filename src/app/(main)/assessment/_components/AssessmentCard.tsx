import React from "react";
import styles from "../assessment.module.css";

type AssessmentCardProps = {
  children?: React.ReactNode;
  className?: string;
};

function AssessmentCard({ children, className = "" }: AssessmentCardProps) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}

export default AssessmentCard;
