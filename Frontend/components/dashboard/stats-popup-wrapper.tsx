"use client";

import { StatsPopup } from "./stats-popup";

type StatsPopupWrapperProps = {
  selectedCar: string;
  isOpen: boolean;
  onClose: () => void;
};

export function StatsPopupWrapper({ selectedCar, isOpen, onClose }: StatsPopupWrapperProps) {
  if (!isOpen) {
    return null;
  }

  return <StatsPopup selectedCar={selectedCar} isOpen={isOpen} onClose={onClose} />;
}