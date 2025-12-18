"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { AddressInput } from "./address-input"
import { DateTimePicker } from "./date-time-picker"

export interface LoadDetails {
  assignedDriver?: string
  pickupAddress: string
  pickupDate: string
  pickupTime: string
  deliveryAddress: string
  deliveryDate: string
  deliveryTime: string
  commodity: string
  weight: string
  brokerContact: string
  shipperContact: string
  referenceNumber: string
  loadNumber: string
  poNumber: string
  bolNumber: string
  additionalNotes: string
  messageType: string
}

interface LoadDetailsFormProps {
  onSubmit: (details: LoadDetails) => void
  isLoading?: boolean
}

const MESSAGE_TYPES = [
  { value: "check-in", label: "Check-in message" },
  { value: "dispatch", label: "Dispatch message" },
  { value: "delay", label: "Delay notification" },
  { value: "delivery-completed", label: "Delivery completed" },
  { value: "tonu-request", label: "TONU request" },
  { value: "pod-request", label: "POD request" },
  { value: "rate-con-request", label: "Rate con request" },
  { value: "eta-update", label: "ETA update" },
  { value: "empty-available", label: "Empty/available message" },
  { value: "weight-commodity-update", label: "Weight/commodity update" },
  { value: "guard-check-in", label: "Guard check-in" },
  { value: "detention-notice", label: "Detention notice" },
  { value: "layover-request", label: "Layover request" },
  { value: "temperature-controlled", label: "Temperature controlled message" },
  { value: "lumper-code", label: "Need lumper code message" },
  { value: "arrival-delivery", label: "Arrival at delivery" },
  { value: "pickup-confirmation", label: "Pickup confirmation" },
  { value: "delivery-confirmation", label: "Delivery confirmation" },
]

export function LoadDetailsForm({ onSubmit, isLoading }: LoadDetailsFormProps) {
  const [formData, setFormData] = useState<LoadDetails>({
    assignedDriver: "",
    pickupAddress: "",
    pickupDate: "",
    pickupTime: "",
    deliveryAddress: "",
    deliveryDate: "",
    deliveryTime: "",
    commodity: "",
    weight: "",
    brokerContact: "",
    shipperContact: "",
    referenceNumber: "",
    loadNumber: "",
    poNumber: "",
    bolNumber: "",
    additionalNotes: "",
    messageType: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateField = (field: keyof LoadDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="messageType" className="text-sm font-semibold">
            Message Type <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.messageType} onValueChange={(value) => updateField("messageType", value)} required>
            <SelectTrigger id="messageType" className="border-primary">
              <SelectValue placeholder="Select message type" />
            </SelectTrigger>
            <SelectContent>
              {MESSAGE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="assignedDriver" className="text-sm font-semibold">
            Assigned Driver (Optional)
          </Label>
          <Input
            id="assignedDriver"
            value={formData.assignedDriver}
            onChange={(e) => updateField("assignedDriver", e.target.value)}
            placeholder="Driver name"
            className="border-primary"
          />
        </div>

        <div>
          <Label htmlFor="pickupAddress" className="text-sm font-semibold">
            Pickup Address <span className="text-red-500">*</span>
          </Label>
          <AddressInput
            id="pickupAddress"
            value={formData.pickupAddress}
            onChange={(value) => updateField("pickupAddress", value)}
            placeholder="Start typing address..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pickupDate" className="text-sm font-semibold">
              Pickup Date <span className="text-red-500">*</span>
            </Label>
            <DateTimePicker
              id="pickupDate"
              type="date"
              value={formData.pickupDate}
              onChange={(value) => updateField("pickupDate", value)}
            />
          </div>
          <div>
            <Label htmlFor="pickupTime" className="text-sm font-semibold">
              Pickup Time <span className="text-red-500">*</span>
            </Label>
            <DateTimePicker
              id="pickupTime"
              type="time"
              value={formData.pickupTime}
              onChange={(value) => updateField("pickupTime", value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="deliveryAddress" className="text-sm font-semibold">
            Delivery Address <span className="text-red-500">*</span>
          </Label>
          <AddressInput
            id="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={(value) => updateField("deliveryAddress", value)}
            placeholder="Start typing address..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="deliveryDate" className="text-sm font-semibold">
              Delivery Date <span className="text-red-500">*</span>
            </Label>
            <DateTimePicker
              id="deliveryDate"
              type="date"
              value={formData.deliveryDate}
              onChange={(value) => updateField("deliveryDate", value)}
            />
          </div>
          <div>
            <Label htmlFor="deliveryTime" className="text-sm font-semibold">
              Delivery Time <span className="text-red-500">*</span>
            </Label>
            <DateTimePicker
              id="deliveryTime"
              type="time"
              value={formData.deliveryTime}
              onChange={(value) => updateField("deliveryTime", value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="commodity" className="text-sm font-semibold">
              Commodity
            </Label>
            <Input
              id="commodity"
              value={formData.commodity}
              onChange={(e) => updateField("commodity", e.target.value)}
              placeholder="e.g., Steel coils"
              className="border-primary"
            />
          </div>
          <div>
            <Label htmlFor="weight" className="text-sm font-semibold">
              Weight
            </Label>
            <Input
              id="weight"
              value={formData.weight}
              onChange={(e) => updateField("weight", e.target.value)}
              placeholder="e.g., 45,000 lbs"
              className="border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="brokerContact" className="text-sm font-semibold">
              Broker Contact
            </Label>
            <Input
              id="brokerContact"
              value={formData.brokerContact}
              onChange={(e) => updateField("brokerContact", e.target.value)}
              placeholder="Name or phone"
              className="border-primary"
            />
          </div>
          <div>
            <Label htmlFor="shipperContact" className="text-sm font-semibold">
              Shipper Contact
            </Label>
            <Input
              id="shipperContact"
              value={formData.shipperContact}
              onChange={(e) => updateField("shipperContact", e.target.value)}
              placeholder="Name or phone"
              className="border-primary"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="referenceNumber" className="text-sm font-semibold">
            Reference Number
          </Label>
          <Input
            id="referenceNumber"
            value={formData.referenceNumber}
            onChange={(e) => updateField("referenceNumber", e.target.value)}
            placeholder="Reference #"
            className="border-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="loadNumber" className="text-sm font-semibold">
              Load #
            </Label>
            <Input
              id="loadNumber"
              value={formData.loadNumber}
              onChange={(e) => updateField("loadNumber", e.target.value)}
              placeholder="Load #"
              className="border-primary"
            />
          </div>
          <div>
            <Label htmlFor="poNumber" className="text-sm font-semibold">
              PO #
            </Label>
            <Input
              id="poNumber"
              value={formData.poNumber}
              onChange={(e) => updateField("poNumber", e.target.value)}
              placeholder="PO #"
              className="border-primary"
            />
          </div>
          <div>
            <Label htmlFor="bolNumber" className="text-sm font-semibold">
              BOL #
            </Label>
            <Input
              id="bolNumber"
              value={formData.bolNumber}
              onChange={(e) => updateField("bolNumber", e.target.value)}
              placeholder="BOL #"
              className="border-primary"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="additionalNotes" className="text-sm font-semibold">
            Additional Notes
          </Label>
          <Textarea
            id="additionalNotes"
            value={formData.additionalNotes}
            onChange={(e) => updateField("additionalNotes", e.target.value)}
            placeholder="Any special instructions or details..."
            className="border-primary min-h-24"
          />
        </div>
      </div>

      <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/80" disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate Message"}
      </Button>
    </form>
  )
}
