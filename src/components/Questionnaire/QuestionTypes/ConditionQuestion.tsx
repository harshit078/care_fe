import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import routes from "@/Utils/request/api";
import useQuery from "@/Utils/request/useQuery";
import {
  CONDITION_CLINICAL_STATUS,
  CONDITION_VERIFICATION_STATUS,
  type Condition,
} from "@/types/questionnaire/condition";
import type { QuestionnaireResponse } from "@/types/questionnaire/form";

interface ConditionQuestionProps {
  questionnaireResponse: QuestionnaireResponse;
  updateQuestionnaireResponseCB: (response: QuestionnaireResponse) => void;
  disabled?: boolean;
}

export function ConditionQuestion({
  questionnaireResponse,
  updateQuestionnaireResponseCB,
  disabled,
}: ConditionQuestionProps) {
  const [conditions, setConditions] = useState<Condition[]>(() => {
    return (questionnaireResponse.values?.[0]?.value as Condition[]) || [];
  });

  const conditionSearch = useQuery(routes.valueset.expand, {
    pathParams: { system: "system-condition-code" },
    body: { count: 10 },
    prefetch: false,
  });

  const handleAddCondition = () => {
    const newConditions = [
      ...conditions,
      { code: { code: "", display: "", system: "" } } as Condition,
    ];
    setConditions(newConditions);
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [
        {
          type: "condition",
          value: newConditions,
        },
      ],
    });
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [
        {
          type: "condition",
          value: newConditions,
        },
      ],
    });
  };

  const updateCondition = (index: number, updates: Partial<Condition>) => {
    const newConditions = conditions.map((condition, i) =>
      i === index ? { ...condition, ...updates } : condition,
    );
    setConditions(newConditions);
    updateQuestionnaireResponseCB({
      ...questionnaireResponse,
      values: [
        {
          type: "condition",
          value: newConditions,
        },
      ],
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Condition</TableHead>
                <TableHead className="w-[150px]">Clinical Status</TableHead>
                <TableHead className="w-[150px]">Verification</TableHead>
                <TableHead className="w-[150px]">Onset Date</TableHead>
                <TableHead className="w-[200px]">Note</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {conditions.map((condition, index) => (
                <TableRow key={index}>
                  <TableCell className="min-w-[200px]">
                    <Popover>
                      <PopoverTrigger asChild disabled={disabled}>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between truncate"
                        >
                          {condition.code.display || "Search conditions..."}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0" align="start">
                        <Command filter={() => 1}>
                          <CommandInput
                            placeholder="Search conditions..."
                            className="my-1"
                            onValueChange={(search) =>
                              conditionSearch.refetch({ body: { search } })
                            }
                          />
                          <CommandList>
                            <CommandEmpty>
                              {conditionSearch.loading
                                ? "Loading..."
                                : "No conditions found"}
                            </CommandEmpty>
                            <CommandGroup>
                              {conditionSearch.data?.results.map(
                                (option) =>
                                  option.code && (
                                    <CommandItem
                                      key={option.code}
                                      value={option.code}
                                      onSelect={() => {
                                        updateCondition(index, {
                                          code: {
                                            code: option.code,
                                            display: option.display || "",
                                            system: option.system || "",
                                          },
                                        });
                                      }}
                                    >
                                      <span>{option.display}</span>
                                    </CommandItem>
                                  ),
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    <Select
                      value={condition.clinicalStatus}
                      onValueChange={(value) =>
                        updateCondition(index, {
                          clinicalStatus: value as Condition["clinicalStatus"],
                        })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-full capitalize">
                        <SelectValue placeholder="Clinical Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITION_CLINICAL_STATUS.map((status) => (
                          <SelectItem
                            className="capitalize"
                            key={status}
                            value={status}
                          >
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    <Select
                      value={condition.verificationStatus}
                      onValueChange={(value) =>
                        updateCondition(index, {
                          verificationStatus:
                            value as Condition["verificationStatus"],
                        })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-full capitalize">
                        <SelectValue placeholder="Verification" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITION_VERIFICATION_STATUS.map((status) => (
                          <SelectItem
                            className="capitalize"
                            key={status}
                            value={status}
                          >
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    <input
                      type="date"
                      className="w-full rounded-md border p-2"
                      value={condition.onsetDateTime || ""}
                      onChange={(e) =>
                        updateCondition(index, {
                          onsetDateTime: e.target.value,
                        })
                      }
                      disabled={disabled}
                    />
                  </TableCell>
                  <TableCell className="min-w-[200px]">
                    <input
                      type="text"
                      className="w-full rounded-md border p-2"
                      placeholder="Note"
                      value={condition.note || ""}
                      onChange={(e) =>
                        updateCondition(index, { note: e.target.value })
                      }
                      disabled={disabled}
                    />
                  </TableCell>
                  <TableCell className="min-w-[50px]">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleRemoveCondition(index)}
                      disabled={disabled}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={handleAddCondition}
          disabled={disabled}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Condition
        </Button>
      </div>
    </div>
  );
}
