"use server";

import { getDashboardData } from "../services/dashboard.service";

export async function fetchDashboardDataAction() {
    return await getDashboardData();
}