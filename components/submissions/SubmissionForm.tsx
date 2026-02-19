"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submissionSchema, type SubmissionFormValues } from "@/lib/validators/submission";
import { trpc } from "@/lib/trpcClient";
import { useRouter, usePathname } from "next/navigation";
import { Upload, X, FileText, File, Image, FileCheck } from "lucide-react";

const SECTION_OPTIONS = [
  "FIRE",
  "OFFICE_CONTENTS",
  "BUSINESS_INTERRUPTION",
  "COMPUTER_ELECTRONIC_EQUIPMENT",
  "BUSINESS_ALL_RISK",
];

const SUB_SECTION_OPTIONS: Record<string, string[]> = {
  FIRE: [
    "Stock",
    "Miscellaneous 1",
    "Miscellaneous 2",
    "Plant/Equipment/Mach/Cont",
  ],
  OFFICE_CONTENTS: [
    "Contents",
    "Rent @ 25 % of Contents S.I.",
  ],
  BUSINESS_INTERRUPTION: [
    "Gross Profit/Rental/Revenue",
    "AICOW",
    "Fines and Penalties",
  ],
  COMPUTER_ELECTRONIC_EQUIPMENT: [
    "Sub-section A: Material Damage",
    "Sub-section B: Reinstatement of data",
    "Increased Cost of Working",
  ],
  BUSINESS_ALL_RISK: [
    "Total Sum Insured",
  ],
};

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface SubmissionFormProps {
  submissionId?: string;
  initialData?: any;
}

export default function SubmissionForm({ submissionId, initialData }: SubmissionFormProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [customSections, setCustomSections] = useState<string[]>([]);
  const [customSubSections, setCustomSubSections] = useState<Record<string, string[]>>({});
  const [newSectionInput, setNewSectionInput] = useState<Record<number, string>>({});
  const [newSubSectionInput, setNewSubSectionInput] = useState<Record<number, string>>({});
  const [showNewSectionInput, setShowNewSectionInput] = useState<Record<number, boolean>>({});
  const [showNewSubSectionInput, setShowNewSubSectionInput] = useState<Record<number, boolean>>({});
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // Generate policy number on mount
  const generatePolicyNo = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return `POL-${year}${month}${day}-${random}`;
  };

  // Parse extra data from initialData if editing
  const parsedExtraData = initialData?.description?.includes("__EXTRA__")
    ? JSON.parse(initialData.description.split("__EXTRA__:")[1] || "{}")
    : {};
  
  const baseDescription = initialData?.description?.split("__EXTRA__")[0] || "";
  
  const form = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      title: initialData?.title || "",
      clientName: initialData?.clientName || "",
      riskType: initialData?.riskType || "Property",
      coverageAmount: initialData?.coverageAmount ? Number(initialData.coverageAmount) : 0,
      description: baseDescription,
      hazards: initialData?.hazards || "",
      premiumEstimate: initialData?.premiumEstimate ? Number(initialData.premiumEstimate) : undefined,
      extra: {
        insuredName: parsedExtraData?.insuredName || "",
        policyNo: parsedExtraData?.policyNo || generatePolicyNo(),
        marketer: parsedExtraData?.marketer || "",
        startDate: parsedExtraData?.startDate || "",
        endDate: parsedExtraData?.endDate || "",
        effectiveDate: parsedExtraData?.effectiveDate || "",
        riskAddress: parsedExtraData?.riskAddress || "",
        occupancyOfRisk: parsedExtraData?.occupancyOfRisk || "",
        construction: parsedExtraData?.construction || "Standard",
        otherInformation: parsedExtraData?.otherInformation || "",
        renewalDetails: parsedExtraData?.renewalDetails || "",
        calculationTables: parsedExtraData?.calculationTables || [
          {
            insuredNameCalc: "",
            location: "",
            calculationRows: [],
          },
        ],
        excludingVATPercent: parsedExtraData?.excludingVATPercent || 100,
        excludingVATAmount: parsedExtraData?.excludingVATAmount,
        hicSharePercent: parsedExtraData?.hicSharePercent,
        hicShareAmount: parsedExtraData?.hicShareAmount,
        shortfallAfterHIC: parsedExtraData?.shortfallAfterHIC,
        proportionalFAC: parsedExtraData?.proportionalFAC || Array(6).fill(null).map(() => ({ percent: undefined, amount: undefined })),
        totalProportionalFACSecured: parsedExtraData?.totalProportionalFACSecured,
        shortfallAfterProportional: parsedExtraData?.shortfallAfterProportional,
        xolFAC: parsedExtraData?.xolFAC || [
          { reinsurer: "Gen Re", percentOfXOLLayer: undefined, exposureOnXOLLayer: undefined },
          { reinsurer: "Swiss Re", percentOfXOLLayer: undefined, exposureOnXOLLayer: undefined },
          { reinsurer: "Reinsurer 3", percentOfXOLLayer: undefined, exposureOnXOLLayer: undefined },
        ],
        totalXOLFACSecured: parsedExtraData?.totalXOLFACSecured,
        shortfallAfterXOL: parsedExtraData?.shortfallAfterXOL,
        reinsurersConditions: parsedExtraData?.reinsurersConditions || "",
        xolPremiumsQuoted: parsedExtraData?.xolPremiumsQuoted,
        totalPremium: parsedExtraData?.totalPremium,
      },
    },
  });

  const calculationTables = useFieldArray({ control: form.control, name: "extra.calculationTables" as const });
  const proportionalFAC = useFieldArray({ control: form.control, name: "extra.proportionalFAC" as const });
  const xolFAC = useFieldArray({ control: form.control, name: "extra.xolFAC" as const });

  const createSubmission = trpc.createSubmission.useMutation({
    onSuccess: () => {
      // Extract role from pathname and navigate back to appropriate dashboard
      const roleMatch = pathname?.match(/\/dashboard\/([^\/]+)/);
      const role = roleMatch ? roleMatch[1] : "broker";
      router.push(`/dashboard/${role}`);
    },
  });
  
  const updateSubmission = trpc.updateSubmission.useMutation({
    onSuccess: () => {
      router.push(`/dashboard/submissions/${submissionId}`);
    },
  });

  function next() {
    setStep((s) => Math.min(4, s + 1));
  }
  function back() {
    if (step === 1) {
      // Navigate back to dashboard when on first step
      // Extract role from pathname and navigate back to appropriate dashboard
      const roleMatch = pathname?.match(/\/dashboard\/([^\/]+)/);
      const role = roleMatch ? roleMatch[1] : "broker";
      router.push(`/dashboard/${role}`);
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
      
      setUploadedFiles((prev) => [
        ...prev,
        {
          id,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview,
        },
      ]);
    });
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleRemoveFile(id: string) {
    setUploadedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function getFileIcon(type: string) {
    if (type.startsWith("image/")) return Image;
    if (type.includes("pdf")) return FileText;
    return File;
  }

  // Format currency as R with spaces for thousands and comma for decimals
  function formatCurrency(amount: number | undefined): string {
    if (amount === undefined || isNaN(amount)) return "R 0,00";
    // Format with spaces as thousands separator and comma as decimal separator
    const formatted = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `R ${formatted.replace(".", ",")}`;
  }

  // Compute summary data from calculation tables
  // Watch calculation tables and their nested rows for reactivity
  const calculationTablesData = form.watch("extra.calculationTables") || [];
  
  // Compute summary data - watch each table's rows individually to ensure reactivity
  const summaryData = (() => {
    if (!calculationTablesData || calculationTablesData.length === 0) {
      return [];
    }

    return calculationTablesData
      .map((table, tableIdx) => {
        // Watch the rows for this specific table to ensure reactivity
        const rows = form.watch(`extra.calculationTables.${tableIdx}.calculationRows`) || table.calculationRows || [];
        
        // Calculate totals from all rows
        const totalSumInsured = rows.reduce((sum, row) => sum + (row.sumInsuredVATIncl || 0), 0);
        const totalPremium = rows.reduce((sum, row) => sum + (row.premiumVATIncl || 0), 0);
        
        // Determine internal approval process based on total sum insured
        // If total sum insured > 200M, show the amount, otherwise show text
        const internalApprovalProcess = totalSumInsured > 200000000 
          ? formatCurrency(totalSumInsured - 200000000) 
          : "Internal Fac Approval";
        
        // Determine external facultative required based on total sum insured
        // If total sum insured > 200M, request fac cover, otherwise no external fac required
        const externalFacRequired = totalSumInsured > 200000000 
          ? "Request Fac Cover" 
          : "No External Fac Required";
        
        return {
          riskAddress: table.location || "",
          insuredName: table.insuredNameCalc || "",
          totalSumInsured,
          totalPremium,
          internalApprovalProcess,
          externalFacRequired,
        };
      });
  })();

  // Compute totals
  const totals = useMemo(() => {
    const totalSumInsured = summaryData.reduce((sum, item) => sum + item.totalSumInsured, 0);
    const totalPremium = summaryData.reduce((sum, item) => sum + item.totalPremium, 0);
    
    // For internal approval process, use the highest value or sum depending on logic
    // Based on the image, it seems to show the highest internal approval amount
    const internalApprovalAmounts = summaryData
      .map((item) => {
        const match = item.internalApprovalProcess.match(/R\s([\d\s,]+)/);
        if (match) {
          return parseFloat(match[1].replace(/\s/g, "").replace(",", "."));
        }
        return 0;
      })
      .filter((val) => val > 0);
    
    const internalApprovalProcess = internalApprovalAmounts.length > 0
      ? formatCurrency(Math.max(...internalApprovalAmounts))
      : summaryData.length > 0 && summaryData[0].totalSumInsured > 200000000
      ? formatCurrency(totalSumInsured - 200000000)
      : "Internal Fac Approval";
    
    return {
      totalSumInsured,
      totalPremium,
      internalApprovalProcess,
    };
  }, [summaryData]);

  async function onSubmit(values: SubmissionFormValues) {
    if (submissionId && initialData) {
      // Update existing submission
      await updateSubmission.mutateAsync({
        id: submissionId,
        ...values,
        coverageAmount: Number(values.coverageAmount),
        premiumEstimate: values.premiumEstimate ? Number(values.premiumEstimate) : undefined,
        extra: values.extra,
      });
    } else {
      // Create new submission
      const fileMetadata = uploadedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: file.preview || null,
      }));

      await createSubmission.mutateAsync({
        ...values,
        coverageAmount: Number(values.coverageAmount),
        premiumEstimate: values.premiumEstimate ? Number(values.premiumEstimate) : undefined,
        attachments: fileMetadata,
      });
    }
  }

  // Load existing attachments when editing
  useEffect(() => {
    if (initialData?.attachments && initialData.attachments.length > 0) {
      const existingFiles = initialData.attachments.map((att: any) => ({
        id: att.id,
        file: new File([], att.fileName), // Placeholder file
        name: att.fileName,
        size: 0, // Size not stored in DB
        type: att.fileType,
        preview: att.url || undefined,
      }));
      setUploadedFiles(existingFiles);
    }
  }, [initialData]);
  
  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [uploadedFiles]);

  // Calculate shortfalls and totals
  const calculations = useMemo(() => {
    const excludingVAT = form.watch("extra.excludingVATAmount") || 0;
    const hicShare = form.watch("extra.hicShareAmount") || 0;
    const shortfallHIC = excludingVAT - hicShare;

    const proportionalTotal =
      form.watch("extra.proportionalFAC")?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
    const shortfallProportional = shortfallHIC - proportionalTotal;

    const xolTotal = form.watch("extra.xolFAC")?.reduce((sum, x) => sum + (x.exposureOnXOLLayer || 0), 0) || 0;
    const shortfallXOL = shortfallProportional - xolTotal;

    return { shortfallHIC, proportionalTotal, shortfallProportional, xolTotal, shortfallXOL };
  }, [form.watch("extra.excludingVATAmount"), form.watch("extra.hicShareAmount"), form.watch("extra.proportionalFAC"), form.watch("extra.xolFAC")]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full max-w-6xl space-y-6 rounded-2xl border border-border/40 bg-card/80 backdrop-blur-md p-8 shadow-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          {submissionId ? "Edit Submission" : "New Submission"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {submissionId ? "Update your insurance risk submission" : "Create a new insurance risk submission"}
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="card-modern p-6">
            <h3 className="mb-3 text-sm font-semibold">General Policy Information</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <LabeledInput label="INSURED NAME" reg={form.register("extra.insuredName")} />
              <div className="space-y-1">
                <label className="text-xs font-medium">POLICY NO</label>
                <input
                  type="text"
                  className="w-full rounded-md border bg-muted px-3 py-2 text-sm outline-none"
                  value={form.watch("extra.policyNo")}
                  readOnly
                  {...form.register("extra.policyNo")}
                />
                <p className="text-xs text-muted-foreground">Auto-generated</p>
              </div>
              <LabeledInput label="MARKETER" reg={form.register("extra.marketer")} />
              <LabeledInput label="START DATE" type="date" reg={form.register("extra.startDate")} />
              <LabeledInput label="END DATE" type="date" reg={form.register("extra.endDate")} />
              <LabeledInput label="EFFECTIVE DATE" type="date" reg={form.register("extra.effectiveDate")} />
            </div>
          </div>

          <div className="card-modern p-6">
            <h3 className="mb-3 text-sm font-semibold">Risk Details</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <LabeledInput label="RISK ADDRESS" reg={form.register("extra.riskAddress")} />
              <LabeledInput label="OCCUPANCY OF RISK" reg={form.register("extra.occupancyOfRisk")} />
              <div className="space-y-1">
                <label className="text-xs font-medium">Construction</label>
                <select
                  className="input-modern"
                  {...form.register("extra.construction")}
                >
                  <option value="Standard">Standard</option>
                  <option value="Non-Standard">Non-Standard</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <LabeledTextarea label="OTHER INFORMATION" reg={form.register("extra.otherInformation")} />
              </div>
              <div className="md:col-span-2">
                <LabeledTextarea label="DETAILS OF RENEWAL OR ENDORSEMENT" reg={form.register("extra.renewalDetails")} />
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Calculation Tables</h3>
            <button
              type="button"
              onClick={() =>
                calculationTables.append({
                  insuredNameCalc: "",
                  location: "",
                  calculationRows: [],
                })
              }
              className="btn-primary"
            >
              Add New Calculation Table
            </button>
          </div>
          {calculationTables.fields.map((table, tableIdx) => {
            const tableRows = form.watch(`extra.calculationTables.${tableIdx}.calculationRows`) || [];

            const addRow = () => {
              const currentRows = form.getValues(`extra.calculationTables.${tableIdx}.calculationRows`) || [];
              form.setValue(`extra.calculationTables.${tableIdx}.calculationRows` as const, [
                ...currentRows,
                {
                  section: "",
                  subSection: "",
                  sumInsuredVATIncl: undefined,
                  premiumVATIncl: undefined,
                  sumInsuredVATExcl: undefined,
                  premiumVATExcl: undefined,
                  rate: undefined,
                },
              ]);
            };

            const removeRow = (rowIdx: number) => {
              const currentRows = form.getValues(`extra.calculationTables.${tableIdx}.calculationRows`) || [];
              form.setValue(`extra.calculationTables.${tableIdx}.calculationRows` as const, currentRows.filter((_: any, i: number) => i !== rowIdx));
            };

            return (
              <div key={table.id} className="rounded-lg border">
                <div className="flex items-center justify-between border-b bg-blue-600 p-3 text-sm font-semibold text-white">
                  <span>Calculation Table {tableIdx + 1}</span>
                  {calculationTables.fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => calculationTables.remove(tableIdx)}
                      className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                    >
                      Remove Table
                    </button>
                  )}
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <LabeledInput
                      label="Insured Name"
                      reg={form.register(`extra.calculationTables.${tableIdx}.insuredNameCalc` as const)}
                    />
                    <LabeledInput
                      label="Location"
                      reg={form.register(`extra.calculationTables.${tableIdx}.location` as const)}
                    />
                  </div>
                  <div className="rounded border">
                    <div className="flex items-center justify-between border-b bg-gray-100 p-2">
                      <span className="text-xs font-medium">Rows</span>
                      <button
                        type="button"
                        onClick={addRow}
                        className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                      >
                        Add Row
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="border-b bg-blue-600 text-white">
                          <tr>
                            <th className="p-2 text-left">Section</th>
                            <th className="p-2 text-left">Sub section</th>
                            <th className="p-2 text-right">Sum insured VAT incl</th>
                            <th className="p-2 text-right">Premium VAT incl</th>
                            <th className="p-2 text-right">Sum insured VAT excl</th>
                            <th className="p-2 text-right">Premium VAT excl</th>
                            <th className="p-2 text-right">Rate</th>
                            <th className="p-2 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableRows.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="p-4 text-center text-sm text-muted-foreground">
                                No rows added. Click "Add Row" to start.
                              </td>
                            </tr>
                          ) : (
                            tableRows.map((row: any, rowIdx: number) => {
                              const rowKey = `${tableIdx}-${rowIdx}`;
                              const vatIncl = form.watch(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.sumInsuredVATIncl`) || 0;
                              const premiumVATIncl = form.watch(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.premiumVATIncl`) || 0;
                      const vatExcl = vatIncl / 1.15; // Calculate VAT exclusive (15% VAT)
                      const premiumVATExcl = premiumVATIncl / 1.15;
                      const rate = vatExcl > 0 ? (premiumVATExcl / vatExcl) * 100 : 0;

                              return (
                                <tr key={rowKey} className={`border-b ${rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                  <td className="p-2">
                                    {showNewSectionInput[rowKey] ? (
                                      <div className="flex gap-1">
                                        <input
                                          type="text"
                                          className="flex-1 rounded border px-2 py-1 text-xs"
                                          placeholder="Enter new section..."
                                          value={newSectionInput[rowKey] || ""}
                                          onChange={(e) => setNewSectionInput({ ...newSectionInput, [rowKey]: e.target.value })}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && newSectionInput[rowKey]?.trim()) {
                                              const newSection = newSectionInput[rowKey].trim();
                                              if (!customSections.includes(newSection) && !SECTION_OPTIONS.includes(newSection)) {
                                                setCustomSections([...customSections, newSection]);
                                              }
                                              form.setValue(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.section` as const, newSection);
                                              form.setValue(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.subSection` as const, "");
                                              setShowNewSectionInput({ ...showNewSectionInput, [rowKey]: false });
                                              setNewSectionInput({ ...newSectionInput, [rowKey]: "" });
                                            }
                                            if (e.key === "Escape") {
                                              setShowNewSectionInput({ ...showNewSectionInput, [rowKey]: false });
                                              setNewSectionInput({ ...newSectionInput, [rowKey]: "" });
                                            }
                                          }}
                                          autoFocus
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (newSectionInput[rowKey]?.trim()) {
                                              const newSection = newSectionInput[rowKey].trim();
                                              if (!customSections.includes(newSection) && !SECTION_OPTIONS.includes(newSection)) {
                                                setCustomSections([...customSections, newSection]);
                                              }
                                              form.setValue(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.section` as const, newSection);
                                              form.setValue(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.subSection` as const, "");
                                              setShowNewSectionInput({ ...showNewSectionInput, [rowKey]: false });
                                              setNewSectionInput({ ...newSectionInput, [rowKey]: "" });
                                            }
                                          }}
                                          className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                                        >
                                          ✓
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setShowNewSectionInput({ ...showNewSectionInput, [rowKey]: false });
                                            setNewSectionInput({ ...newSectionInput, [rowKey]: "" });
                                          }}
                                          className="rounded bg-gray-300 px-2 py-1 text-xs hover:bg-gray-400"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ) : (
                                      <select
                                        className="w-full rounded border px-2 py-1"
                                        {...form.register(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.section` as const)}
                                        onChange={(e) => {
                                          if (e.target.value === "__ADD_NEW__") {
                                            setShowNewSectionInput({ ...showNewSectionInput, [rowKey]: true });
                                          } else {
                                            form.setValue(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.section` as const, e.target.value);
                                            form.setValue(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.subSection` as const, ""); // Clear sub section when section changes
                                          }
                                        }}
                                      >
                                        <option value="">Select...</option>
                                        {[...SECTION_OPTIONS, ...customSections].map((opt) => (
                                          <option key={opt} value={opt}>
                                            {opt}
                                          </option>
                                        ))}
                                        <option value="__ADD_NEW__" className="font-semibold">+ Add new section</option>
                                      </select>
                                    )}
                                  </td>
                                  <td className="p-2">
                                    {showNewSubSectionInput[rowKey] ? (
                                      <div className="flex gap-1">
                                        <input
                                          type="text"
                                          className="flex-1 rounded border px-2 py-1 text-xs"
                                          placeholder="Enter new sub section..."
                                          value={newSubSectionInput[rowKey] || ""}
                                          onChange={(e) => setNewSubSectionInput({ ...newSubSectionInput, [rowKey]: e.target.value })}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter" && newSubSectionInput[rowKey]?.trim()) {
                                              const currentSection = form.watch(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.section`) as string;
                                              const newSubSection = newSubSectionInput[rowKey].trim();
                                              const existingSubs = SUB_SECTION_OPTIONS[currentSection] || [];
                                              const customSubs = customSubSections[currentSection] || [];
                                              
                                              if (!existingSubs.includes(newSubSection) && !customSubs.includes(newSubSection)) {
                                                setCustomSubSections({
                                                  ...customSubSections,
                                                  [currentSection]: [...customSubs, newSubSection],
                                                });
                                              }
                                              form.setValue(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.subSection` as const, newSubSection);
                                              setShowNewSubSectionInput({ ...showNewSubSectionInput, [rowKey]: false });
                                              setNewSubSectionInput({ ...newSubSectionInput, [rowKey]: "" });
                                            }
                                            if (e.key === "Escape") {
                                              setShowNewSubSectionInput({ ...showNewSubSectionInput, [rowKey]: false });
                                              setNewSubSectionInput({ ...newSubSectionInput, [rowKey]: "" });
                                            }
                                          }}
                                          autoFocus
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (newSubSectionInput[rowKey]?.trim()) {
                                              const currentSection = form.watch(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.section`) as string;
                                              const newSubSection = newSubSectionInput[rowKey].trim();
                                              const existingSubs = SUB_SECTION_OPTIONS[currentSection] || [];
                                              const customSubs = customSubSections[currentSection] || [];
                                              
                                              if (!existingSubs.includes(newSubSection) && !customSubs.includes(newSubSection)) {
                                                setCustomSubSections({
                                                  ...customSubSections,
                                                  [currentSection]: [...customSubs, newSubSection],
                                                });
                                              }
                                              form.setValue(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.subSection` as const, newSubSection);
                                              setShowNewSubSectionInput({ ...showNewSubSectionInput, [rowKey]: false });
                                              setNewSubSectionInput({ ...newSubSectionInput, [rowKey]: "" });
                                            }
                                          }}
                                          className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                                        >
                                          ✓
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setShowNewSubSectionInput({ ...showNewSubSectionInput, [rowKey]: false });
                                            setNewSubSectionInput({ ...newSubSectionInput, [rowKey]: "" });
                                          }}
                                          className="rounded bg-gray-300 px-2 py-1 text-xs hover:bg-gray-400"
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ) : (
                                      <select
                                        className="w-full rounded border px-2 py-1"
                                        {...form.register(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.subSection` as const)}
                                        disabled={!form.watch(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.section`)}
                                        onChange={(e) => {
                                          if (e.target.value === "__ADD_NEW__") {
                                            setShowNewSubSectionInput({ ...showNewSubSectionInput, [rowKey]: true });
                                          } else {
                                            form.setValue(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.subSection` as const, e.target.value);
                                          }
                                        }}
                                      >
                                        <option value="">
                                          {form.watch(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.section`) ? "Select sub section..." : "Select section first"}
                                        </option>
                                        {form.watch(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.section`) && (
                                          <>
                                            {[
                                              ...(SUB_SECTION_OPTIONS[form.watch(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.section`) as string] || []),
                                              ...(customSubSections[form.watch(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.section`) as string] || []),
                                            ].map((subSec) => (
                                              <option key={subSec} value={subSec}>
                                                {subSec}
                                              </option>
                                            ))}
                                            <option value="__ADD_NEW__" className="font-semibold">+ Add new sub section</option>
                                          </>
                                        )}
                                      </select>
                                    )}
                                  </td>
                                  <td className="p-2">
                                    <input
                                      type="number"
                                      step="0.01"
                                      className="w-32 rounded border px-2 py-1 text-right"
                                      placeholder="0.00"
                                      {...form.register(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.sumInsuredVATIncl` as const, {
                                        valueAsNumber: true,
                                      })}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        form.setValue(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.sumInsuredVATIncl` as const, val);
                                        const newVatExcl = val / 1.15;
                                        const newPremiumVATExcl = (form.getValues(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.premiumVATIncl` as const) || 0) / 1.15;
                                        const newRate = newVatExcl > 0 ? (newPremiumVATExcl / newVatExcl) * 100 : 0;
                                        form.setValue(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.sumInsuredVATExcl` as const, Number(newVatExcl.toFixed(2)));
                                        form.setValue(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.rate` as const, Number(newRate.toFixed(3)));
                                      }}
                                    />
                                  </td>
                                  <td className="p-2">
                                    <input
                                      type="number"
                                      step="0.01"
                                      className="w-32 rounded border px-2 py-1 text-right"
                                      placeholder="0.00"
                                      {...form.register(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.premiumVATIncl` as const, {
                                        valueAsNumber: true,
                                      })}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        form.setValue(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.premiumVATIncl` as const, val);
                                        const newPremiumVATExcl = val / 1.15;
                                        const newVatExcl = (form.getValues(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.sumInsuredVATIncl` as const) || 0) / 1.15;
                                        const newRate = newVatExcl > 0 ? (newPremiumVATExcl / newVatExcl) * 100 : 0;
                                        form.setValue(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.premiumVATExcl` as const, Number(newPremiumVATExcl.toFixed(2)));
                                        form.setValue(`extra.calculationTables.${tableIdx}.calculationRows.${rowIdx}.rate` as const, Number(newRate.toFixed(3)));
                                      }}
                                    />
                                  </td>
                                  <td className="p-2">
                                    <input
                                      type="text"
                                      className="w-32 rounded border bg-gray-100 px-2 py-1 text-right"
                                      value={vatExcl.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      readOnly
                                    />
                                  </td>
                                  <td className="p-2">
                                    <input
                                      type="text"
                                      className="w-32 rounded border bg-gray-100 px-2 py-1 text-right"
                                      value={premiumVATExcl.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      readOnly
                                    />
                                  </td>
                                  <td className="p-2">
                                    <input
                                      type="text"
                                      className="w-24 rounded border bg-gray-100 px-2 py-1 text-right"
                                      value={`${rate.toFixed(3)}%`}
                                      readOnly
                                    />
                                  </td>
                                  <td className="p-2 text-center">
                                    <button
                                      type="button"
                                      onClick={() => removeRow(rowIdx)}
                                      className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200"
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Summary Table */}
          {calculationTablesData && calculationTablesData.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold">Summary Table</h3>
              <div className="overflow-x-auto rounded-lg border border-border/40 bg-background/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-teal-600">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white">Risk Address</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white">Insured Name</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white">Total Sum Insured</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white">Total Premium amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white">Internal Approval Process</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white">External Facultative Required</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {summaryData.length > 0 ? (
                      <>
                        {summaryData.map((item, idx) => (
                          <tr key={idx} className="transition-all duration-200 hover:bg-primary/5">
                            <td className="px-4 py-3 align-top">{item.riskAddress || "-"}</td>
                            <td className="px-4 py-3 align-top font-medium">{item.insuredName || "-"}</td>
                            <td className="px-4 py-3 align-top text-right">{formatCurrency(item.totalSumInsured)}</td>
                            <td className="px-4 py-3 align-top text-right">{formatCurrency(item.totalPremium)}</td>
                            <td className="px-4 py-3 align-top">{item.internalApprovalProcess}</td>
                            <td className="px-4 py-3 align-top">{item.externalFacRequired}</td>
                          </tr>
                        ))}
                        {/* Totals Row */}
                        <tr className="border-t-2 border-border bg-muted/30 font-semibold">
                          <td className="px-4 py-3 align-top"></td>
                          <td className="px-4 py-3 align-top"></td>
                          <td className="px-4 py-3 align-top text-right">{formatCurrency(totals.totalSumInsured)}</td>
                          <td className="px-4 py-3 align-top text-right">{formatCurrency(totals.totalPremium)}</td>
                          <td className="px-4 py-3 align-top">{totals.internalApprovalProcess}</td>
                          <td className="px-4 py-3 align-top border border-green-300"></td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                          No calculation data yet. Add rows to the calculation tables above to see summary.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="card-modern p-6">
            <h3 className="mb-4 text-sm font-semibold">Reinsurance Placements and Shortfalls</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded border p-2">
                  <span className="text-sm">Excluding 15% VAT</span>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="w-20 rounded border px-2 py-1 text-right text-sm"
                      placeholder="%"
                      {...form.register("extra.excludingVATPercent", { valueAsNumber: true })}
                    />
                    <input
                      type="number"
                      className="w-32 rounded border px-2 py-1 text-right text-sm"
                      placeholder="R"
                      {...form.register("extra.excludingVATAmount", { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded border p-2">
                  <span className="text-sm">HIC Share + PML</span>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="w-20 rounded border px-2 py-1 text-right text-sm"
                      placeholder="%"
                      {...form.register("extra.hicSharePercent", { valueAsNumber: true })}
                    />
                    <input
                      type="number"
                      className="w-32 rounded border px-2 py-1 text-right text-sm"
                      placeholder="R"
                      {...form.register("extra.hicShareAmount", { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded border border-red-300 bg-red-50 p-2">
                  <span className="text-sm font-medium">Shortfall after HIC Share</span>
                  <span className="text-sm font-semibold text-red-700">R {calculations.shortfallHIC.toLocaleString()}</span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-sm font-semibold">Proportional FAC placements</div>
                  <div className="space-y-2">
                    {proportionalFAC.fields.map((field, idx) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <span className="w-8 text-xs">{idx + 1}.</span>
                        <input
                          type="number"
                          className="w-20 rounded border px-2 py-1 text-right text-xs"
                          placeholder="%"
                          {...form.register(`extra.proportionalFAC.${idx}.percent` as const, { valueAsNumber: true })}
                        />
                        <input
                          type="number"
                          className="flex-1 rounded border px-2 py-1 text-right text-xs"
                          placeholder="R"
                          {...form.register(`extra.proportionalFAC.${idx}.amount` as const, { valueAsNumber: true })}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between rounded border p-2 text-sm">
                    <span>Total Proportional FAC secured</span>
                    <span>R {calculations.proportionalTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between rounded border border-red-300 bg-red-50 p-2 text-sm font-medium">
                    <span>Shortfall after Proportional Placements</span>
                    <span className="text-red-700">R {calculations.shortfallProportional.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="rounded border border-red-300 bg-red-50 p-2 text-xs text-red-700">
                    NOTE: If Proportional Facultative support has dried up approach XOL Reinsurers
                  </div>
                  <div className="text-sm font-semibold">Excess of Loss FAC placements</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="border-b bg-muted/30">
                        <tr>
                          <th className="p-1 text-left">Reinsurer</th>
                          <th className="p-1 text-right">% of XOL Layer</th>
                          <th className="p-1 text-right">Exposure on XOL Layer</th>
                        </tr>
                      </thead>
                      <tbody>
                        {xolFAC.fields.map((field, idx) => (
                          <tr key={field.id} className="border-b">
                            <td className="p-1">{field.reinsurer}</td>
                            <td className="p-1">
                              <input
                                type="number"
                                className="w-full rounded border px-1 py-0.5 text-right"
                                placeholder="%"
                                {...form.register(`extra.xolFAC.${idx}.percentOfXOLLayer` as const, { valueAsNumber: true })}
                              />
                            </td>
                            <td className="p-1">
                              <input
                                type="number"
                                className="w-full rounded border px-1 py-0.5 text-right"
                                placeholder="R"
                                {...form.register(`extra.xolFAC.${idx}.exposureOnXOLLayer` as const, { valueAsNumber: true })}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between rounded border p-2 text-sm">
                    <span>Total XOL FAC secured</span>
                    <span>R {calculations.xolTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between rounded border border-red-300 bg-red-50 p-2 text-sm font-medium">
                    <span>Shortfall after XOL Placements</span>
                    <span className="text-red-700">R {calculations.shortfallXOL.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Reinsurer's Conditions for support</label>
                  <textarea
                    className="h-32 w-full rounded border px-3 py-2 text-sm"
                    {...form.register("extra.reinsurersConditions")}
                    placeholder="Enter conditions..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">XOL Premiums Quoted (Vat Excl. FOC)</label>
                  <input
                    type="number"
                    className="w-full rounded border px-3 py-2 text-sm"
                    placeholder="R"
                    {...form.register("extra.xolPremiumsQuoted", { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    What is the Total Premium (Vat & Comm Incl.) of the items / sections we are obtaining Facultative Reinsurance support for?
                  </label>
                  <input
                    type="number"
                    className="w-full rounded border px-3 py-2 text-sm"
                    placeholder="R"
                    {...form.register("extra.totalPremium", { valueAsNumber: true })}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">This is required for the Pareto Model</p>
                </div>
                <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-3 text-xs">
                  Approach XOL Reinsurers for{" "}
                  <span className="font-semibold">R{calculations.shortfallXOL.toLocaleString()}</span> in Excess of{" "}
                  <span className="font-semibold">R{(form.watch("extra.hicShareAmount") || 0).toLocaleString()}</span> in respect of HIC's 100% share of the Risk
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          {/* Document Upload Section */}
          <div className="card-modern p-6">
            <h3 className="mb-4 text-sm font-semibold">Attach Documents</h3>
            <p className="mb-4 text-xs text-muted-foreground">
              Upload supporting documents such as policy documents, certificates, survey reports, or other relevant files.
            </p>

            {/* File Upload Area */}
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/30 p-8 transition-colors hover:border-primary hover:bg-muted/50"
              >
                <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                <div className="text-sm font-medium">Click to upload or drag and drop</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF (Max 10MB per file)
                </div>
              </label>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Uploaded Documents ({uploadedFiles.length})</h4>
                  <div className="text-xs text-muted-foreground">
                    Total size: {formatFileSize(uploadedFiles.reduce((sum, f) => sum + f.size, 0))}
                  </div>
                </div>
                <div className="space-y-2">
                  {uploadedFiles.map((uploadedFile) => {
                    const FileIcon = getFileIcon(uploadedFile.type);
                    return (
                      <div
                        key={uploadedFile.id}
                        className="flex items-center justify-between rounded-lg border bg-card p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex-shrink-0 rounded border bg-muted p-2">
                            <FileIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          {uploadedFile.preview && (
                            <div className="flex-shrink-0">
                              <img
                                src={uploadedFile.preview}
                                alt={uploadedFile.name}
                                className="h-12 w-12 rounded border object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{uploadedFile.name}</div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{formatFileSize(uploadedFile.size)}</span>
                              <span>•</span>
                              <span>{uploadedFile.type || "Unknown type"}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(uploadedFile.id)}
                          className="ml-3 flex-shrink-0 rounded-md p-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                          title="Remove file"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {uploadedFiles.length === 0 && (
              <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
                <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
                <p className="mt-1 text-xs text-muted-foreground">Documents are optional but recommended</p>
              </div>
            )}
          </div>

          {/* Submission Preview */}
          <div className="card-modern p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Submission Preview</h3>
              <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Ready to Submit
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Basic Submission Information */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Submission Details</h4>
                <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 md:grid-cols-2">
                  <div>
                    <span className="text-xs text-muted-foreground">Title:</span>
                    <p className="text-sm font-medium">{form.watch("title") || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Client Name:</span>
                    <p className="text-sm font-medium">{form.watch("clientName") || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Risk Type:</span>
                    <p className="text-sm font-medium">{form.watch("riskType") || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Coverage Amount:</span>
                    <p className="text-sm font-medium">{formatCurrency(form.watch("coverageAmount"))}</p>
                  </div>
                  {form.watch("premiumEstimate") && (
                    <div>
                      <span className="text-xs text-muted-foreground">Premium Estimate:</span>
                      <p className="text-sm font-medium">{formatCurrency(form.watch("premiumEstimate"))}</p>
                    </div>
                  )}
                  {form.watch("hazards") && (
                    <div className="md:col-span-2">
                      <span className="text-xs text-muted-foreground">Hazards:</span>
                      <p className="text-sm font-medium">{form.watch("hazards")}</p>
                    </div>
                  )}
                  {form.watch("description") && (
                    <div className="md:col-span-2">
                      <span className="text-xs text-muted-foreground">Description:</span>
                      <p className="text-sm font-medium whitespace-pre-wrap">{form.watch("description")}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* General Policy Information */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">General Policy Information</h4>
                <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 md:grid-cols-2">
                  <div>
                    <span className="text-xs text-muted-foreground">Insured Name:</span>
                    <p className="text-sm font-medium">{form.watch("extra.insuredName") || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Policy Number:</span>
                    <p className="text-sm font-medium font-mono">{form.watch("extra.policyNo") || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Marketer:</span>
                    <p className="text-sm font-medium">{form.watch("extra.marketer") || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Start Date:</span>
                    <p className="text-sm font-medium">{form.watch("extra.startDate") || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">End Date:</span>
                    <p className="text-sm font-medium">{form.watch("extra.endDate") || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Effective Date:</span>
                    <p className="text-sm font-medium">{form.watch("extra.effectiveDate") || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Risk Details */}
              <div>
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Risk Details</h4>
                <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 md:grid-cols-2">
                  <div>
                    <span className="text-xs text-muted-foreground">Risk Address:</span>
                    <p className="text-sm font-medium">{form.watch("extra.riskAddress") || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Occupancy of Risk:</span>
                    <p className="text-sm font-medium">{form.watch("extra.occupancyOfRisk") || "-"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Construction:</span>
                    <p className="text-sm font-medium">{form.watch("extra.construction") || "-"}</p>
                  </div>
                  {form.watch("extra.otherInformation") && (
                    <div className="md:col-span-2">
                      <span className="text-xs text-muted-foreground">Other Information:</span>
                      <p className="text-sm font-medium whitespace-pre-wrap">{form.watch("extra.otherInformation")}</p>
                    </div>
                  )}
                  {form.watch("extra.renewalDetails") && (
                    <div className="md:col-span-2">
                      <span className="text-xs text-muted-foreground">Renewal/Endorsement Details:</span>
                      <p className="text-sm font-medium whitespace-pre-wrap">{form.watch("extra.renewalDetails")}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Calculation Tables */}
              {calculationTablesData && calculationTablesData.length > 0 && (
                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Calculation Tables</h4>
                  <div className="space-y-4">
                    {calculationTablesData.map((table, tableIdx) => {
                      const rows = form.watch(`extra.calculationTables.${tableIdx}.calculationRows`) || [];
                      if (rows.length === 0) return null;
                      
                      return (
                        <div key={tableIdx} className="rounded-lg border bg-muted/30 p-4">
                          <div className="mb-3 flex items-center justify-between border-b pb-2">
                            <div>
                              <h5 className="text-sm font-semibold">Table {tableIdx + 1}</h5>
                              {table.location && (
                                <p className="text-xs text-muted-foreground">Location: {table.location}</p>
                              )}
                              {table.insuredNameCalc && (
                                <p className="text-xs text-muted-foreground">Insured Name: {table.insuredNameCalc}</p>
                              )}
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b bg-muted">
                                  <th className="px-2 py-1 text-left">Section</th>
                                  <th className="px-2 py-1 text-left">Sub-Section</th>
                                  <th className="px-2 py-1 text-right">Sum Insured (VAT Incl.)</th>
                                  <th className="px-2 py-1 text-right">Premium (VAT Incl.)</th>
                                  <th className="px-2 py-1 text-right">Sum Insured (VAT Excl.)</th>
                                  <th className="px-2 py-1 text-right">Premium (VAT Excl.)</th>
                                  <th className="px-2 py-1 text-right">Rate %</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                {rows.map((row: any, rowIdx: number) => (
                                  <tr key={rowIdx}>
                                    <td className="px-2 py-1">{row.section || "-"}</td>
                                    <td className="px-2 py-1">{row.subSection || "-"}</td>
                                    <td className="px-2 py-1 text-right">{formatCurrency(row.sumInsuredVATIncl)}</td>
                                    <td className="px-2 py-1 text-right">{formatCurrency(row.premiumVATIncl)}</td>
                                    <td className="px-2 py-1 text-right">{formatCurrency(row.sumInsuredVATExcl)}</td>
                                    <td className="px-2 py-1 text-right">{formatCurrency(row.premiumVATExcl)}</td>
                                    <td className="px-2 py-1 text-right">{row.rate ? `${row.rate.toFixed(3)}%` : "-"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Calculation Summary Table */}
                  {summaryData.length > 0 && (
                    <div className="mt-4">
                      <h5 className="mb-2 text-xs font-semibold">Summary Table</h5>
                      <div className="overflow-x-auto rounded-lg border bg-muted/30">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-muted">
                              <th className="px-3 py-2 text-left text-xs font-semibold">Risk Address</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold">Insured Name</th>
                              <th className="px-3 py-2 text-right text-xs font-semibold">Total Sum Insured</th>
                              <th className="px-3 py-2 text-right text-xs font-semibold">Total Premium</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold">Internal Approval Process</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold">External Facultative Required</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {summaryData.map((item, idx) => (
                              <tr key={idx} className="hover:bg-muted/50">
                                <td className="px-3 py-2">{item.riskAddress || "-"}</td>
                                <td className="px-3 py-2 font-medium">{item.insuredName || "-"}</td>
                                <td className="px-3 py-2 text-right">{formatCurrency(item.totalSumInsured)}</td>
                                <td className="px-3 py-2 text-right">{formatCurrency(item.totalPremium)}</td>
                                <td className="px-3 py-2">{item.internalApprovalProcess}</td>
                                <td className="px-3 py-2">{item.externalFacRequired}</td>
                              </tr>
                            ))}
                            <tr className="border-t-2 bg-muted/50 font-semibold">
                              <td colSpan={2} className="px-3 py-2">Total</td>
                              <td className="px-3 py-2 text-right">{formatCurrency(totals.totalSumInsured)}</td>
                              <td className="px-3 py-2 text-right">{formatCurrency(totals.totalPremium)}</td>
                              <td className="px-3 py-2">{totals.internalApprovalProcess}</td>
                              <td className="px-3 py-2"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reinsurance Placements */}
              {(form.watch("extra.excludingVATAmount") || form.watch("extra.hicShareAmount") || form.watch("extra.proportionalFAC")?.some((p: any) => p.amount) || form.watch("extra.xolFAC")?.some((x: any) => x.exposureOnXOLLayer)) && (
                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reinsurance Placements and Shortfalls</h4>
                  <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                    {/* Excluding VAT */}
                    {(form.watch("extra.excludingVATPercent") || form.watch("extra.excludingVATAmount")) && (
                      <div className="flex items-center justify-between rounded border p-2">
                        <span className="text-sm">Excluding 15% VAT</span>
                        <div className="flex gap-2 text-sm">
                          {form.watch("extra.excludingVATPercent") && (
                            <span>{form.watch("extra.excludingVATPercent")}%</span>
                          )}
                          {form.watch("extra.excludingVATAmount") && (
                            <span className="font-medium">{formatCurrency(form.watch("extra.excludingVATAmount"))}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* HIC Share */}
                    {(form.watch("extra.hicSharePercent") || form.watch("extra.hicShareAmount")) && (
                      <div className="flex items-center justify-between rounded border p-2">
                        <span className="text-sm">HIC Share + PML</span>
                        <div className="flex gap-2 text-sm">
                          {form.watch("extra.hicSharePercent") && (
                            <span>{form.watch("extra.hicSharePercent")}%</span>
                          )}
                          {form.watch("extra.hicShareAmount") && (
                            <span className="font-medium">{formatCurrency(form.watch("extra.hicShareAmount"))}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Shortfall after HIC */}
                    {calculations.shortfallHIC > 0 && (
                      <div className="flex items-center justify-between rounded border border-red-300 bg-red-50 p-2">
                        <span className="text-sm font-medium">Shortfall after HIC Share</span>
                        <span className="text-sm font-semibold text-red-700">{formatCurrency(calculations.shortfallHIC)}</span>
                      </div>
                    )}

                    {/* Proportional FAC */}
                    {form.watch("extra.proportionalFAC")?.some((p: any) => p.percent || p.amount) && (
                      <div className="space-y-2">
                        <div className="text-sm font-semibold">Proportional FAC Placements</div>
                        <div className="space-y-1">
                          {form.watch("extra.proportionalFAC")?.map((fac: any, idx: number) => {
                            if (!fac.percent && !fac.amount) return null;
                            return (
                              <div key={idx} className="flex items-center justify-between rounded border p-2 text-xs">
                                <span>{idx + 1}. Proportional FAC</span>
                                <div className="flex gap-2">
                                  {fac.percent && <span>{fac.percent}%</span>}
                                  {fac.amount && <span className="font-medium">{formatCurrency(fac.amount)}</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {calculations.proportionalTotal > 0 && (
                          <div className="flex items-center justify-between rounded border p-2 text-sm">
                            <span>Total Proportional FAC Secured</span>
                            <span className="font-medium">{formatCurrency(calculations.proportionalTotal)}</span>
                          </div>
                        )}
                        {calculations.shortfallProportional > 0 && (
                          <div className="flex items-center justify-between rounded border border-red-300 bg-red-50 p-2 text-sm font-medium">
                            <span>Shortfall after Proportional Placements</span>
                            <span className="text-red-700">{formatCurrency(calculations.shortfallProportional)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* XOL FAC */}
                    {form.watch("extra.xolFAC")?.some((x: any) => x.percentOfXOLLayer || x.exposureOnXOLLayer) && (
                      <div className="space-y-2">
                        <div className="text-sm font-semibold">Excess of Loss FAC Placements</div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead className="border-b bg-muted">
                              <tr>
                                <th className="px-2 py-1 text-left">Reinsurer</th>
                                <th className="px-2 py-1 text-right">% of XOL Layer</th>
                                <th className="px-2 py-1 text-right">Exposure on XOL Layer</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {form.watch("extra.xolFAC")?.map((xol: any, idx: number) => {
                                if (!xol.percentOfXOLLayer && !xol.exposureOnXOLLayer) return null;
                                return (
                                  <tr key={idx}>
                                    <td className="px-2 py-1">{xol.reinsurer || `Reinsurer ${idx + 1}`}</td>
                                    <td className="px-2 py-1 text-right">{xol.percentOfXOLLayer ? `${xol.percentOfXOLLayer}%` : "-"}</td>
                                    <td className="px-2 py-1 text-right">{formatCurrency(xol.exposureOnXOLLayer)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        {calculations.xolTotal > 0 && (
                          <div className="flex items-center justify-between rounded border p-2 text-sm">
                            <span>Total XOL FAC Secured</span>
                            <span className="font-medium">{formatCurrency(calculations.xolTotal)}</span>
                          </div>
                        )}
                        {calculations.shortfallXOL > 0 && (
                          <div className="flex items-center justify-between rounded border border-red-300 bg-red-50 p-2 text-sm font-medium">
                            <span>Shortfall after XOL Placements</span>
                            <span className="text-red-700">{formatCurrency(calculations.shortfallXOL)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reinsurer Conditions */}
                    {form.watch("extra.reinsurersConditions") && (
                      <div>
                        <span className="text-xs font-medium text-muted-foreground">Reinsurer's Conditions for Support:</span>
                        <p className="mt-1 text-sm whitespace-pre-wrap">{form.watch("extra.reinsurersConditions")}</p>
                      </div>
                    )}

                    {/* XOL Premiums Quoted */}
                    {form.watch("extra.xolPremiumsQuoted") && (
                      <div className="flex items-center justify-between rounded border p-2">
                        <span className="text-sm">XOL Premiums Quoted (VAT Excl. FOC)</span>
                        <span className="text-sm font-medium">{formatCurrency(form.watch("extra.xolPremiumsQuoted"))}</span>
                      </div>
                    )}

                    {/* Total Premium */}
                    {form.watch("extra.totalPremium") && (
                      <div className="flex items-center justify-between rounded border p-2">
                        <span className="text-sm">Total Premium (VAT & Comm Incl.)</span>
                        <span className="text-sm font-medium">{formatCurrency(form.watch("extra.totalPremium"))}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Attached Documents */}
              {uploadedFiles.length > 0 && (
                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attached Documents ({uploadedFiles.length})</h4>
                  <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
                    {uploadedFiles.map((file) => {
                      const FileIcon = getFileIcon(file.type);
                      return (
                        <div key={file.id} className="flex items-center gap-2 text-sm">
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{file.name}</span>
                          <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t pt-4">
        <button
          type="button"
          onClick={back}
          className="btn-secondary"
        >
          {step === 1 ? "Cancel" : "Back"}
        </button>
        {step < 4 ? (
          <button type="button" onClick={next} className="btn-primary px-6">
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="btn-primary px-6"
            disabled={createSubmission.isLoading || updateSubmission.isLoading}
          >
            {createSubmission.isLoading || updateSubmission.isLoading
              ? submissionId
                ? "Updating..."
                : "Submitting..."
              : submissionId
              ? "Update Submission"
              : "Submit Submission"}
          </button>
        )}
      </div>
    </form>
  );
}

function LabeledInput({ label, reg, type = "text", placeholder }: { label: string; reg: any; type?: string; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium">{label}</label>
      <input type={type} className="input-modern" placeholder={placeholder} {...reg} />
    </div>
  );
}

function LabeledTextarea({ label, reg }: { label: string; reg: any }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium">{label}</label>
      <textarea className="input-modern min-h-[80px]" {...reg} />
    </div>
  );
}
