import React from "react";
import { Package, Truck, Check, Warehouse, User } from "lucide-react";

interface Order {
  id: string;
  status: string;
  createdAt: string;
}

interface OrderTrackerProps {
  order: Order;
}

export function OrderTracker({ order }: OrderTrackerProps) {
  const steps = [
    {
      status: "PENDING",
      icon: Package,
      label: "Order Placed",
      description: "Order has been placed and waiting for assignment",
    },
    {
      status: "ASSIGNED",
      icon: User,
      label: "Delivery Agent Assigned",
      description: "A delivery agent has been assigned to your order",
    },
    {
      status: "PICKED_UP",
      icon: Warehouse,
      label: "Picked Up",
      description: "Order has been picked up by delivery agent",
    },
    {
      status: "DELIVERED",
      icon: Check,
      label: "Delivered",
      description: "Order has been delivered successfully",
    },
  ];

  const currentStepIndex = steps.findIndex(
    (step) => step.status === order.status
  );

  return (
    <div className="w-full py-6">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2" />
        <div
          className="absolute left-0 top-1/2 h-1 bg-green-500 -translate-y-1/2 transition-all duration-500"
          style={{
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.status} className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center 
                    transition-all duration-500
                    ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-400"
                    }
                    ${isCurrent ? "ring-4 ring-green-200" : ""}
                  `}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
                <div className="mt-2 text-center">
                  <span
                    className={`
                    text-sm font-medium block
                    ${isCompleted ? "text-gray-900" : "text-gray-500"}
                  `}
                  >
                    {step.label}
                  </span>
                  <span className="text-xs text-gray-500 mt-1 block max-w-[120px]">
                    {step.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Message */}
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Current Status:{" "}
          <span className="font-medium text-gray-900">
            {steps.find((step) => step.status === order.status)?.label ||
              "Processing"}
          </span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Last updated: {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}