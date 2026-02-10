import { NextResponse } from "next/server";
import { ESTIMATOR_SERVICES } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const { serviceId, factor } = await request.json();

    const service = ESTIMATOR_SERVICES.find((s) => s.id === serviceId);
    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const factorIndex = service.factors.indexOf(factor);
    if (factorIndex === -1) {
      return NextResponse.json({ error: "Invalid factor" }, { status: 400 });
    }

    const multiplier = 0.5 + (factorIndex / (service.factors.length - 1)) * 1;
    const min = Math.round((service.baseMin * multiplier) / 50) * 50;
    const max = Math.round((service.baseMax * multiplier) / 50) * 50;

    return NextResponse.json({ min, max, service: service.label, factor });
  } catch {
    return NextResponse.json(
      { error: "Failed to calculate estimate" },
      { status: 500 }
    );
  }
}
