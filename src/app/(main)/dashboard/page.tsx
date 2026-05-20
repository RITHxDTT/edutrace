"use client";
import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@heroui/table";
import styles from './kpicard.module.css';

export default function Page() {
  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <p className="text-[24px] font-medium">Dashboard</p>
          <p>Welcome back, Tan Dara</p>
        </div>
      </div>

      {/* KPI Card */}
      <div>
        <svg
          className={styles.svgAsset}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="clip" clipPathUnits="objectBoundingBox">
              <path d="M0.0587,0H0.8534A0.0293,0.0431,0,0,1,0.8827,0.0431V0.1293A0.0293,0.0431,0,0,0,0.912,0.1724H0.9707A0.0293,0.0431,0,0,1,1,0.2155V0.9138A0.0587,0.0862,0,0,1,0.9413,1H0.0587A0.0587,0.0862,0,0,1,0,0.9138V0.0862A0.0587,0.0862,0,0,1,0.0587,0Z" />
            </clipPath>
          </defs>
        </svg>

        <div className="flex justify-between items-center gap-[20px]">
          
          <div className={styles.inverted}>
            <div className="p-5">
              <label>Total tasks</label>

              <div className="space-y-10">
                <p className="color-lavender">56</p>
                <p>from all class</p>
              </div>
            </div>
          </div>

          <div className={styles.inverted}>
            <div className="p-5">
              <label>Total tasks</label>

              <div className="space-y-10">
                <p className="text-purple font-heading">56</p>
                <p>from all class</p>
              </div>
            </div>
          </div>

          <div className={styles.inverted}>
            <div className="p-5">
              <label>Total tasks</label>

              <div className="space-y-10">
                <p className="color-lavender">56</p>
                <p>from all class</p>
              </div>
            </div>
          </div>

          <div className={styles.inverted}>
            <div className="p-5">
              <label>Total tasks</label>

              <div className="space-y-10">
                <p className="color-lavender">56</p>
                <p>from all class</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-[20px] font-semibold">
              Student Progress
            </p>
            <p className="text-sm text-gray-500">
              Recent student activities
            </p>
          </div>
        </div>

        <Table isStriped aria-label="Student progress table"
        >
          <TableHeader>
            <TableColumn>Student Name</TableColumn>
            <TableColumn>Completion</TableColumn>
            <TableColumn>Late</TableColumn>
             <TableColumn>Status</TableColumn>
          </TableHeader>

          <TableBody>
            <TableRow key="1">
              <TableCell>Yann Vannet</TableCell>
              <TableCell>100%</TableCell>
              <TableCell>2%</TableCell>
                <TableCell>Good</TableCell>
            </TableRow>

            <TableRow key="2">
              <TableCell>Uy Chakriya</TableCell>
              <TableCell>95%</TableCell>
              <TableCell>5%</TableCell>
              <TableCell>Good</TableCell>
            </TableRow>

            <TableRow key="3">
              <TableCell>Dara Nikorr</TableCell>
              <TableCell>45%</TableCell>
              <TableCell>55%</TableCell>
              <TableCell>At Risk</TableCell>
            </TableRow>

          </TableBody>
        </Table>
        
      </div> 
    </div>
  );
}