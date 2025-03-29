"use client"


import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQuery, useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

// Add the missing imports
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Check } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandItem, CommandGroup } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useCallback, useState } from "react"
import SVGUpload from "./SVGUpload"
import { useSession } from "next-auth/react"

// Form Schema with zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Tile Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  categories: z.array(z.string()).min(1, {
    message: "Select at least one category.",
  }),
  gridSelection: z.string().min(2, {
    message: "Grid Selection must be at least 2 characters.",
  }),
})

type FormValues = z.infer<typeof formSchema>

const gridSelectionData = ["1x1", "2x2"]

const AddNewTile = () => {
  const [svgData, setSvgData] = useState<string>("")
  const [open, setOpen] = useState(false)

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      categories: [],
      gridSelection: "",
    },
  })

  const session = useSession()
    const token = (session?.data?.user as { token: string })?.token

    console.log(token);

  // Fetch categories from the API
  const { data: categoriesData, error } = useQuery({
    queryKey: ["allTilesCategories"],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`)
      if (!response.ok) {
        throw new Error("Failed to fetch categories")
      }
      return response.json()
    },
  })

  // Handle mutation for submitting the form
  const mutation = useMutation({
    mutationFn: async (formData: {
      tileName: string;
      description: string;
      categories: string[];
      gridSelection: string;
      svg: string; // Assuming this is the SVG file
    }) => {
  
      if (!token) {
        throw new Error("Authorization token is missing.");
      }
  
      // Create FormData instance
      const form = new FormData();
      form.append("tileName", formData.tileName);
      form.append("description", formData.description);
      form.append("categories", JSON.stringify(formData.categories)); // You might need to send categories as a stringified array
      form.append("gridSelection", formData.gridSelection);
  
      // Assuming the SVG is a base64 string or a file, append accordingly
      if (formData.svg) {
        // If SVG is a file:
        // form.append("svg", formData.svg); // Assuming formData.svg is a file object
        // If SVG is base64 string:
        form.append("svg", formData.svg); // You may want to convert it to a Blob if required by the backend
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tiles`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: form,
      });
  
      if (!response.ok) {
        throw new Error("Failed to create tile");
      }
  
      return response.json();
    },
    onSuccess: () => {
      toast.success("Tile created successfully", {
        description: "Your new tile has been added.",
      });
      form.reset();
      setSvgData(""); // Reset SVG and form state
    },
    onError: (error) => {
      toast.error("Failed to create tile", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const handleSvgChange = useCallback((newSvgData: string) => {
    setSvgData(newSvgData)
  }, [])

  if (error) {
    toast.error("Failed to load categories", {
      description: error.message,
    })
  }

  const onSubmit = (data: FormValues) => {
    if (!svgData) {
      toast.error("Missing SVG", {
        description: "Please upload an SVG file",
      })
      return
    }

    // Find selected category IDs
    const selectedCategoryIds = data.categories
      .map((categoryName) => {
        const category = categoriesData?.data?.find((item: { name: string }) => item.name === categoryName)
        return category ? String(category.id) : null
      })
      .filter(Boolean) as string[]

    if (selectedCategoryIds.length === 0) {
      toast.error("Invalid Categories", {
        description: "Please select at least one valid category",
      })
      return
    }

    const formData = {
      tileName: data.name,
      description: data.description,
      categories: selectedCategoryIds,
      gridSelection: data.gridSelection,
      svg: svgData,
    }

    // const loadingToast = toast.loading("Creating tile...", {
    //   description: "Please wait while we save your tile",
    // })

    mutation.mutate(formData)
  }

  return (
    <div className="pb-14">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 border border-[#B0B0B0] rounded-[8px] p-6">
            <div className="md:grid-cols-1 ">
              <div className="pb-[14px]">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-secondary-200">Tile Name</FormLabel>
                      <FormControl>
                        <Input
                          className="h-[40px] placeholder:text-secondary-100 focus-visible:ring-0"
                          placeholder="Input The Tile"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pb-[14px]">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-secondary-200">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="h-[156px] placeholder:text-secondary-100 focus-visible:ring-0"
                          placeholder="Type category description here..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
                <div className="pb-[14px]">
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-base font-medium text-secondary-200">Categories</FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className={cn(
                                  "w-full h-[40px] justify-between",
                                  !field.value.length && "text-muted-foreground",
                                )}
                              >
                                {field.value.length ? `${field.value.length} selected` : "Select categories"}
                                <div className="ml-2 flex gap-1 flex-wrap">
                                  {field.value.length > 0 && (
                                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                      {field.value.length}
                                    </Badge>
                                  )}
                                </div>
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search categories..." />
                              <CommandList>
                                <CommandEmpty>No categories found.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                {categoriesData?.data?.map((category: { id: number; name: string }) => {
                                    const isSelected = field.value.includes(category.name)
                                    return (
                                      <CommandItem
                                        key={category.id}
                                        onSelect={() => {
                                          if (isSelected) {
                                            form.setValue(
                                              "categories",
                                              field.value.filter((value) => value !== category.name),
                                            )
                                          } else {
                                            form.setValue("categories", [...field.value, category.name])
                                          }
                                        }}
                                      >
                                        <div
                                          className={cn(
                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                            isSelected
                                              ? "bg-primary text-primary-foreground"
                                              : "opacity-50 [&_svg]:invisible",
                                          )}
                                        >
                                          <Check className={cn("h-4 w-4")} />
                                        </div>
                                        <span>{category.name}</span>
                                      </CommandItem>
                                    )
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pb-[14px]">
                  <FormField
                    control={form.control}
                    name="gridSelection"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium text-secondary-200">Grid Selection</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="w-full h-[40px] focus-visible:outline-none focus-visible:ring-0">
                              <SelectValue placeholder="Select a grid" />
                            </SelectTrigger>
                            <SelectContent className="focus:outline-none focus:ring-0">
                              {gridSelectionData.map((item) => (
                                <SelectItem key={item} value={item} className="focus:outline-none focus:ring-0">
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="md:grid-cols-1">
              <h3 className="text-xl font-semibold text-[#1A1C21] leading-[120%] mb-[14px]">Add Photo</h3>
              <div className="pt-[14px]">
                <SVGUpload onUpload={handleSvgChange} maxSizeKB={500} />
              </div>

              {/* button  */}
              <div className="pt-10 w-full flex items-center justify-end">
                <Button
                  type="submit"
                  className="flex items-center gap-2 text-white bg-primary py-3 px-8 text-base font-medium leading-[120%] rounded-[8px]"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save /> Save tile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default AddNewTile
