"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoState } from "@/lib/redux/hooks";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { useDemoActions } from "@/lib/redux/hooks";
import {
  searchObjects,
  sortObjects,
  highlightSearchTerms,
} from "@/lib/utils/search";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  TicketIcon,
  ChevronDownIcon,
  PlusCircleIcon,
  TrashIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  ArrowLeftIcon,
  CalendarIcon,
  BuildingStorefrontIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/atoms/Button/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/molecules/dialog/Dialog";

// Import Redux actions
import {
  setSearchQuery,
  selectCustomer,
  setViewState,
  toggleTokenCatalog,
  addTokenToCustomer,
  removeTokenFromCustomer,
  reissueToken,
  saveCaseNotes,
  clearActionMessage,
  selectToken,
  updateTokenFilters,
  applyPresetFilter,
  setCurrentPage,
  setItemsPerPage,
  markTokenDisputed,
  setTokenSort,
  SortOptions,
  initializeState,
} from "@/lib/redux/slices/cvsTokenSlice";

// Import createAction to help us create the missing actions
import { createAction } from "@reduxjs/toolkit";

// Create the missing action creators
const setShowConfirmModal = createAction<boolean>(
  "cvsToken/setShowConfirmModal"
);
const setConfirmAction = createAction<"reissue" | "remove" | "dispute" | null>(
  "cvsToken/setConfirmAction"
);
const setShowTokenDetail = createAction<boolean>("cvsToken/setShowTokenDetail");

// Types for the token management interface
// Keep these exported so they can be used in the Redux slice
export interface TokenInfo {
  id: string;
  name: string;
  description: string;
  type: "Coupon" | "Reward" | "ExtraBucks" | "Lightning";
  state: "Active" | "Shared" | "Used" | "Expired";
  claimDate: string;
  useDate?: string;
  shareDate?: string;
  expirationDate: string;
  merchantName?: string;
  merchantLocation?: string;
  value: string;
  externalUrl?: string;
}

export interface CustomerInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  extraCareId: string;
  accountCreated: string;
  address: {
    street: string;
    aptUnit?: string;
    city: string;
    state: string;
    zip: string;
  };
  tokens: TokenInfo[];
}

// Mock customer data
const mockCustomers: CustomerInfo[] = [
  {
    id: "cust001",
    firstName: "Emily",
    lastName: "Johnson",
    email: "emily.johnson@example.com",
    phone: "(555) 123-4567",
    extraCareId: "4872913650",
    accountCreated: "2021-06-15",
    address: {
      street: "123 Market Street",
      aptUnit: "Apt 4B",
      city: "Boston",
      state: "MA",
      zip: "02108",
    },
    tokens: [
      {
        id: "tok001",
        name: "$5 ExtraBucks Rewards",
        description:
          "Earn $5 ExtraBucks Rewards when you spend $20 on beauty products",
        type: "ExtraBucks",
        state: "Active",
        claimDate: "2023-05-10",
        expirationDate: "2023-06-10",
        merchantName: "CVS Pharmacy",
        merchantLocation: "Downtown",
        value: "$5.00",
        externalUrl: "https://www.cvs.com/extracare/token/view?id=tok001",
      },
      {
        id: "tok002",
        name: "20% Off Vitamins",
        description: "20% off your purchase of vitamins and supplements",
        type: "Coupon",
        state: "Expired",
        claimDate: "2023-04-01",
        expirationDate: "2023-05-01",
        merchantName: "CVS Pharmacy",
        merchantLocation: "Westside Mall",
        value: "20%",
        externalUrl: "https://www.cvs.com/extracare/token/view?id=tok002",
      },
    ],
  },
  {
    id: "cust002",
    firstName: "Michael",
    lastName: "Williams",
    email: "michael.williams@example.com",
    phone: "(555) 987-6543",
    extraCareId: "7391265480",
    accountCreated: "2020-11-22",
    address: {
      street: "456 Commonwealth Avenue",
      city: "Boston",
      state: "MA",
      zip: "02215",
    },
    tokens: [
      {
        id: "tok003",
        name: "30% Off Contact Lenses",
        description: "30% off any contact lens purchase",
        type: "Coupon",
        state: "Used",
        claimDate: "2023-05-15",
        useDate: "2023-05-20",
        expirationDate: "2023-06-15",
        merchantName: "CVS Pharmacy",
        merchantLocation: "North Avenue",
        value: "30%",
        externalUrl: "https://www.cvs.com/extracare/token/view?id=tok003",
      },
    ],
  },
  {
    id: "cust003",
    firstName: "Sophia",
    lastName: "Martinez",
    email: "sophia.martinez@example.com",
    phone: "(555) 234-5678",
    extraCareId: "6129385740",
    accountCreated: "2022-01-07",
    address: {
      street: "789 Boylston Street",
      aptUnit: "Suite 300",
      city: "Boston",
      state: "MA",
      zip: "02199",
    },
    tokens: [],
  },
];

// Add these additional sample customers to the mockCustomers array at the top of the file, before the export default function
const additionalSampleCustomers: CustomerInfo[] = [
  {
    id: "cust004",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(555) 432-1098",
    extraCareId: "5134982760",
    accountCreated: "2022-01-12",
    address: {
      street: "101 Beacon Street",
      aptUnit: "Unit 15",
      city: "Boston",
      state: "MA",
      zip: "02116",
    },
    tokens: [
      {
        id: "tok004",
        name: "$7 ExtraBucks Rewards",
        description: "$7 ExtraBucks Rewards for beauty purchases",
        type: "ExtraBucks",
        state: "Active",
        claimDate: "2023-05-20",
        expirationDate: "2023-06-20",
        merchantName: "CVS Pharmacy",
        merchantLocation: "Eastside Plaza",
        value: "$7.00",
        externalUrl: "https://www.cvs.com/extracare/token/view?id=tok004",
      },
      {
        id: "tok005",
        name: "25% Off Cosmetics",
        description: "25% off cosmetics purchase",
        type: "Coupon",
        state: "Active",
        claimDate: "2023-05-01",
        expirationDate: "2023-06-01",
        merchantName: "CVS Pharmacy",
        merchantLocation: "Eastside Plaza",
        value: "25%",
        externalUrl: "https://www.cvs.com/extracare/token/view?id=tok005",
      },
      {
        id: "tok006",
        name: "BOGO Vitamins",
        description: "Buy one get one free on select vitamins",
        type: "Coupon",
        state: "Used",
        claimDate: "2023-04-01",
        useDate: "2023-04-15",
        expirationDate: "2023-05-01",
        merchantName: "CVS Pharmacy",
        value: "BOGO",
        externalUrl: "https://www.cvs.com/extracare/token/view?id=tok006",
      },
      {
        id: "tok007",
        name: "Free Photo Print",
        description: "One free 4x6 photo print",
        type: "Coupon",
        state: "Used",
        claimDate: "2023-03-20",
        useDate: "2023-04-10",
        expirationDate: "2023-04-20",
        merchantName: "CVS Pharmacy",
        value: "FREE",
        externalUrl: "https://www.cvs.com/extracare/token/view?id=tok007",
      },
      {
        id: "tok008",
        name: "First Aid Kit Discount",
        description: "20% off first aid supplies",
        type: "Coupon",
        state: "Used",
        claimDate: "2023-02-15",
        useDate: "2023-03-01",
        expirationDate: "2023-03-15",
        merchantName: "CVS Pharmacy",
        value: "20%",
        externalUrl: "https://www.cvs.com/extracare/token/view?id=tok008",
      },
      {
        id: "tok009",
        name: "$3 Seasonal Items",
        description: "$3 off seasonal merchandise",
        type: "Coupon",
        state: "Used",
        claimDate: "2023-01-25",
        useDate: "2023-02-10",
        expirationDate: "2023-02-25",
        merchantName: "CVS Pharmacy",
        value: "$3.00",
        externalUrl: "https://www.cvs.com/extracare/token/view?id=tok009",
      },
    ],
  },
  {
    id: "cust005",
    firstName: "Alice",
    lastName: "Smith",
    email: "alice.smith@example.com",
    phone: "(555) 789-6543",
    extraCareId: "7892136540",
    accountCreated: "2023-03-23",
    address: {
      street: "222 Tremont Street",
      aptUnit: "Apt 7C",
      city: "Boston",
      state: "MA",
      zip: "02116",
    },
    tokens: [
      {
        id: "tok010",
        name: "Flash Sale: $5 ExtraBucks",
        description: "Limited time $5 offer - Today only!",
        type: "Lightning",
        state: "Active",
        claimDate: "2023-05-25",
        expirationDate: "2023-05-26",
        merchantName: "CVS Pharmacy",
        value: "$5.00",
        externalUrl: "https://www.cvs.com/extracare/token/view?id=tok010",
      },
    ],
  },
  {
    id: "cust006",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.j@example.com",
    phone: "(555) 321-7890",
    extraCareId: "3698521470",
    accountCreated: "2021-11-05",
    address: {
      street: "333 Newbury Street",
      city: "Boston",
      state: "MA",
      zip: "02115",
    },
    tokens: [
      {
        id: "tok011",
        name: "40% Off Sunscreen",
        description: "40% off all sunscreen products",
        type: "Coupon",
        state: "Expired",
        claimDate: "2023-03-01",
        expirationDate: "2023-04-01",
        merchantName: "CVS Pharmacy",
        value: "40%",
        externalUrl: "https://www.cvs.com/extracare/token/view?id=tok011",
      },
      {
        id: "tok012",
        name: "$10 Off $40 Purchase",
        description: "$10 off when you spend $40 or more",
        type: "Coupon",
        state: "Expired",
        claimDate: "2023-02-01",
        expirationDate: "2023-03-01",
        merchantName: "CVS Pharmacy",
        value: "$10.00",
        externalUrl: "https://www.cvs.com/extracare/token/view?id=tok012",
      },
    ],
  },
];

// Mock token catalog for adding to customers
const generateTokenCatalog = () => {
  const tokens: TokenInfo[] = [];
  const tokenTypes = ["ExtraBucks", "Coupon", "Reward", "Lightning"];
  const categories = [
    "Beauty",
    "Pharmacy",
    "Health",
    "Vitamins",
    "Baby",
    "Personal Care",
    "Seasonal",
    "Photo",
    "Grocery",
    "Electronics",
  ];
  const merchants = [
    "CVS Pharmacy",
    "CVS MinuteClinic",
    "CVS HealthHUB",
    "CVS Photo",
    "CVS Pharmacy y más",
  ];

  // Generate 50 tokens with diverse attributes
  for (let i = 1; i <= 50; i++) {
    const type = tokenTypes[Math.floor(Math.random() * tokenTypes.length)] as
      | "Coupon"
      | "Reward"
      | "ExtraBucks"
      | "Lightning";
    const category = categories[Math.floor(Math.random() * categories.length)];
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];

    // Generate different types of values
    let value;
    if (type === "ExtraBucks" || (type === "Reward" && Math.random() > 0.5)) {
      // Dollar values for ExtraBucks and some Rewards
      const amount = Math.floor(Math.random() * 50) + 1;
      value = `$${amount}.00`;
    } else if (type === "Coupon") {
      // Percentage discounts for coupons
      const percentage = (Math.floor(Math.random() * 10) + 1) * 5; // 5%, 10%, ..., 50%
      value = `${percentage}%`;
    } else if (type === "Lightning") {
      // Flash deals are typically lower value but urgent
      const amount = Math.floor(Math.random() * 10) + 1;
      value = `$${amount}.00`;
    } else {
      // Other rewards like BOGO or free items
      const specialOffers = ["BOGO", "FREE", "2for1", "Buy2Get1"];
      value = specialOffers[Math.floor(Math.random() * specialOffers.length)];
    }

    // Generate varied expiration dates
    const daysToExpire =
      type === "Lightning"
        ? Math.floor(Math.random() * 3) + 1 // 1-3 days for Lightning deals
        : Math.floor(Math.random() * 90) + 7; // 7-97 days for other tokens

    const expirationDate = new Date(
      Date.now() + daysToExpire * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0];
    const claimDate = new Date().toISOString().split("T")[0];

    tokens.push({
      id: `cat${i.toString().padStart(3, "0")}`,
      name: generateTokenName(type, category, value),
      description: generateTokenDescription(type, category, value),
      type,
      state: "Active",
      claimDate,
      expirationDate,
      merchantName: merchant,
      value,
    });
  }

  return tokens;
};

// Helper functions for generating token content
const generateTokenName = (
  type: "Coupon" | "Reward" | "ExtraBucks" | "Lightning",
  category: string,
  value: string
) => {
  if (type === "ExtraBucks") {
    return `${value} ExtraBucks Rewards on ${category}`;
  } else if (type === "Coupon") {
    return `${value} off ${category} products`;
  } else if (type === "Lightning") {
    return `Flash Deal: ${value} off ${category} - Today Only!`;
  } else {
    return `${category} Reward: ${value}`;
  }
};

const generateTokenDescription = (
  type: "Coupon" | "Reward" | "ExtraBucks" | "Lightning",
  category: string,
  value: string
) => {
  const descriptions = [
    `Save ${value} when you purchase any ${category} product.`,
    `Get ${value} discount on your next ${category} purchase.`,
    `Special offer: ${value} on all ${category} items in store and online.`,
    `Member-exclusive savings of ${value} in the ${category} department.`,
    `Limited time offer: ${value} savings on ${category} products.`,
    `ExtraCare members save ${value} on select ${category} items.`,
  ];

  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

// Replace the previous static tokenCatalog with our generator
const generatedTokenCatalog: TokenInfo[] = generateTokenCatalog();

// Add a new function to highlight matched text in search results
const HighlightedText = ({
  text,
  searchTerm,
}: {
  text: string;
  searchTerm: string;
}) => {
  const { parts } = highlightSearchTerms(text, searchTerm);

  return (
    <>
      {parts.map((part, index) => (
        <span key={index} className={part.highlight ? "bg-yellow-200" : ""}>
          {part.text}
        </span>
      ))}
    </>
  );
};

// Format date for display - move outside component for SSR
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  } catch (e) {
    return dateString;
  }
};

// Get badge color based on token state - move outside component for SSR
const getTokenStateBadgeColor = (state: string) => {
  switch (state) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Used":
      return "bg-gray-100 text-gray-800";
    case "Expired":
      return "bg-red-100 text-red-800";
    case "Shared":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Get badge color based on token type - move outside component for SSR
const getTokenTypeBadgeColor = (type: string) => {
  switch (type) {
    case "ExtraBucks":
      return "bg-yellow-100 text-yellow-800";
    case "Coupon":
      return "bg-purple-100 text-purple-800";
    case "Reward":
      return "bg-blue-100 text-blue-800";
    case "Lightning":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

import AppLayout from "@/components/templates/AppLayout/AppLayout";

export default function CVSTokenManagement() {
  const { userProfile, theme, themeMode } = useDemoState();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { updateDemoState } = useDemoActions();

  // Add this state to prevent hydration errors
  const [isClient, setIsClient] = useState(false);

  // Redux state
  const {
    customers,
    searchQuery,
    customerResults,
    selectedCustomer,
    selectedToken,
    showTokenCatalog,
    actionMessage,
    caseNotes,
    viewState,
    hasSearched,
    tokenCatalog,
    tokenFilters,
    pagination,
    tokenSort,
    showTokenDetail,
    showConfirmModal,
    confirmAction,
  } = useAppSelector((state) => state.cvsToken);

  // Get the sidebar width from Redux state
  const { sidebarWidth } = useAppSelector((state) => state.ui);

  // Local state for UI elements that don't need to be in Redux
  const [caseNotesInput, setCaseNotesInput] = useState(caseNotes);
  // Move isExpanded state to component level to avoid Rules of Hooks violation
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // CVS ExtraCare branding colors
  const cvsRed = "#CC0000";
  const cvsDarkBlue = "#0077C8";
  const cvsLightBlue = "#009FDA";
  const kigoBlue = "#2563EB";

  // Add state for confirm modal
  const [confirmTokenId, setConfirmTokenId] = useState<string | null>(null);
  const [confirmReason, setConfirmReason] = useState("");
  const [confirmComments, setConfirmComments] = useState("");
  const [notHonored, setNotHonored] = useState(false);

  // Add state for token search UI
  const [tokenSearchInput, setTokenSearchInput] = useState("");
  const [isTokenSearchFocused, setIsTokenSearchFocused] = useState(false);

  // Add state for token catalog search
  const [catalogSearchInput, setCatalogSearchInput] = useState("");
  const [filteredCatalogTokens, setFilteredCatalogTokens] = useState<
    TokenInfo[]
  >(generatedTokenCatalog);

  // Add this near the other state declarations
  const hasInitialized = useRef(false);

  // Initialize Redux state only once on the client-side
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      setIsClient(true);
      dispatch(initializeState());

      // Set the proper demo context for consistent styling across all CVS pages
      updateDemoState({
        clientId: "cvs",
        scenario: "support-flow",
        role: "support",
        themeMode: "light",
      });
    }
  }, [dispatch, updateDemoState]);

  // Force light mode for this component
  useEffect(() => {
    // Set theme to light mode
    if (themeMode !== "light") {
      router.replace(
        "/demos/cvs-token-management?role=support&client=cvs&scenario=support-flow&theme=light"
      );
    }
  }, [themeMode, router]);

  // Ensure we're using the correct demo context
  useEffect(() => {
    // Check if we already have the correct context
    if (userProfile?.role === "CVS ExtraCare Support Specialist") return;

    // If not, redirect to the page with the proper URL parameters
    router.replace(
      "/demos/cvs-token-management?role=support&client=cvs&scenario=support-flow&theme=light"
    );
  }, [userProfile, router]);

  // Updated search function to use Redux
  const handleSearch = () => {
    dispatch(setSearchQuery(searchQuery));
  };

  // Modified selectCustomer to use Redux
  const selectCustomerHandler = (customerId: string) => {
    dispatch(selectCustomer(customerId));
  };

  // Function to go back to main view
  const backToMainView = () => {
    // Only change the view state, don't reset search results
    dispatch(setViewState("main"));

    // If we had search results, make sure hasSearched remains true
    if (customerResults.length > 0) {
      // Force the search to run again to restore results
      handleSearch();
    }
  };

  // Add a token to the selected customer
  const addTokenToCustomerHandler = (tokenId: string) => {
    dispatch(addTokenToCustomer(tokenId));

    // Clear action message after 3 seconds
    setTimeout(() => dispatch(clearActionMessage()), 3000);
  };

  // Updated reissueTokenHandler to show confirmation modal
  const reissueTokenHandler = (tokenId: string) => {
    setConfirmAction("reissue");
    setConfirmTokenId(tokenId);
    setShowConfirmModal(true);
  };

  // Updated removeTokenFromCustomerHandler to show confirmation modal
  const removeTokenFromCustomerHandler = (tokenId: string) => {
    setConfirmAction("remove");
    setConfirmTokenId(tokenId);
    setShowConfirmModal(true);
  };

  // New handler for marking a token as disputed
  const markTokenDisputedHandler = (tokenId: string) => {
    setConfirmAction("dispute");
    setConfirmTokenId(tokenId);
    setShowConfirmModal(true);
  };

  // Handle confirm action
  const handleConfirmAction = () => {
    if (!confirmTokenId) return;

    switch (confirmAction) {
      case "reissue":
        dispatch(
          reissueToken({
            tokenId: confirmTokenId,
            reason: confirmReason,
            comments: confirmComments,
          })
        );
        break;
      case "remove":
        dispatch(removeTokenFromCustomer(confirmTokenId));
        break;
      case "dispute":
        dispatch(
          markTokenDisputed({
            tokenId: confirmTokenId,
            reason: confirmReason,
            notHonored: notHonored,
          })
        );
        break;
    }

    // Clear action message after 3 seconds
    setTimeout(() => dispatch(clearActionMessage()), 3000);

    // Reset confirm modal state
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmTokenId(null);
    setConfirmReason("");
    setConfirmComments("");
    setNotHonored(false);
  };

  // Save case notes
  const handleSaveNotes = () => {
    dispatch(saveCaseNotes(caseNotesInput));

    // Clear action message after 3 seconds
    setTimeout(() => dispatch(clearActionMessage()), 3000);
  };

  // Search on enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Run search when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    }
  }, [searchQuery]);

  // Function to handle external URL click
  const handleViewInExtraCare = (url: string | undefined) => {
    if (!url) {
      console.log("No external URL available");
      return;
    }

    // In a real application, this would navigate to the external URL
    // For the demo, we'll just log it and show an alert
    console.log("Navigating to external URL:", url);
    window.alert(`This would open the token in the Extra Care system: ${url}`);

    // In production, we might use:
    // window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Helper function to get filtered tokens
  const getFilteredTokens = () => {
    if (!selectedCustomer) return [];

    let filteredTokens = [...selectedCustomer.tokens];

    // Apply status filters
    if (tokenFilters.status.length > 0) {
      filteredTokens = filteredTokens.filter((token) =>
        tokenFilters.status.includes(token.state)
      );
    }

    // Apply type filters
    if (tokenFilters.types.length > 0) {
      filteredTokens = filteredTokens.filter((token) =>
        tokenFilters.types.includes(token.type)
      );
    }

    // Apply date range filters
    if (tokenFilters.dateRange.start) {
      filteredTokens = filteredTokens.filter((token) => {
        // Check against multiple date fields
        const tokenDate =
          token.state === "Used"
            ? token.useDate
            : token.state === "Shared"
              ? token.shareDate
              : token.claimDate;

        return tokenDate && tokenDate >= tokenFilters.dateRange.start;
      });
    }

    if (tokenFilters.dateRange.end) {
      filteredTokens = filteredTokens.filter((token) => {
        // For expiration dates
        return token.expirationDate <= tokenFilters.dateRange.end;
      });
    }

    // Apply merchant filter
    if (tokenFilters.merchant) {
      filteredTokens = filteredTokens.filter(
        (token) =>
          token.merchantName &&
          token.merchantName
            .toLowerCase()
            .includes(tokenFilters.merchant.toLowerCase())
      );
    }

    // Apply search query using our utility
    if (tokenFilters.searchQuery) {
      filteredTokens = searchObjects(filteredTokens, tokenFilters.searchQuery, [
        "name",
        "description",
        "value",
        "merchantName",
        "merchantLocation",
      ]);
    }

    // Apply sorting using our utility
    return sortObjects(filteredTokens, tokenSort.field, tokenSort.direction);
  };

  // Add a function to handle sorting
  const handleSort = (field: SortOptions["field"]) => {
    dispatch(setTokenSort({ field }));
  };

  // Get filtered tokens - memoize for better performance
  const filteredTokens = React.useMemo(
    () => getFilteredTokens(),
    [selectedCustomer, tokenFilters, tokenSort]
  );

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: any) => {
    dispatch(updateTokenFilters({ filterType, value }));
  };

  // Preset filters for common scenarios
  const handleApplyPresetFilter = (preset: string) => {
    dispatch(applyPresetFilter(preset));
  };

  // Function to get paginated customers
  const getPaginatedCustomers = () => {
    const { currentPage, itemsPerPage } = pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return customers.slice(startIndex, endIndex);
  };

  // Render pagination controls
  const renderPagination = () => {
    const { currentPage, totalPages } = pagination;

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border border-gray-200 rounded-md">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => dispatch(setCurrentPage(currentPage - 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => dispatch(setCurrentPage(currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * pagination.itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(
                  currentPage * pagination.itemsPerPage,
                  customers.length
                )}
              </span>{" "}
              of <span className="font-medium">{customers.length}</span>{" "}
              customers
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => dispatch(setCurrentPage(currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => dispatch(setCurrentPage(i + 1))}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                    currentPage === i + 1
                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => dispatch(setCurrentPage(currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  // Render items per page selector
  const renderPerPageSelector = () => {
    return (
      <div className="flex items-center">
        <span className="text-sm text-gray-500 mr-2">Items per page:</span>
        <select
          value={pagination.itemsPerPage}
          onChange={(e) => dispatch(setItemsPerPage(Number(e.target.value)))}
          className="border border-gray-300 rounded-md text-sm p-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    );
  };

  // Render customer profile
  const renderCustomerProfile = () => {
    if (!selectedCustomer) return null;

    const getTokenCountByState = () => {
      const counts = {
        total: selectedCustomer.tokens.length,
        active: 0,
        expired: 0,
        used: 0,
        shared: 0,
      };

      selectedCustomer.tokens.forEach((token) => {
        if (token.state === "Active") counts.active++;
        else if (token.state === "Expired") counts.expired++;
        else if (token.state === "Used") counts.used++;
        else if (token.state === "Shared") counts.shared++;
      });

      return counts;
    };

    const tokenCounts = getTokenCountByState();

    return (
      <div className="bg-white rounded-lg shadow-md p-6 h-full">
        <div className="border-b pb-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Customer Information
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Customer Details
            </h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">
                  Name:
                </span>
                <span className="text-sm text-gray-900">
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </span>
              </div>
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">
                  Email:
                </span>
                <span className="text-sm text-gray-900">
                  {selectedCustomer.email}
                </span>
              </div>
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">
                  Phone:
                </span>
                <span className="text-sm text-gray-900">
                  {selectedCustomer.phone}
                </span>
              </div>
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">
                  Extra Care ID:
                </span>
                <span className="text-sm text-gray-900">
                  {selectedCustomer.extraCareId}
                </span>
              </div>
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">
                  Created:
                </span>
                <span className="text-sm text-gray-900">
                  {formatDate(selectedCustomer.accountCreated)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Address
            </h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">
                  Street:
                </span>
                <span className="text-sm text-gray-900">
                  {selectedCustomer.address.street}
                </span>
              </div>
              {selectedCustomer.address.aptUnit && (
                <div className="flex">
                  <span className="text-sm font-medium text-gray-500 w-32">
                    Unit/Apt:
                  </span>
                  <span className="text-sm text-gray-900">
                    {selectedCustomer.address.aptUnit}
                  </span>
                </div>
              )}
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">
                  City:
                </span>
                <span className="text-sm text-gray-900">
                  {selectedCustomer.address.city}
                </span>
              </div>
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">
                  State:
                </span>
                <span className="text-sm text-gray-900">
                  {selectedCustomer.address.state}
                </span>
              </div>
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-32">
                  Zip Code:
                </span>
                <span className="text-sm text-gray-900">
                  {selectedCustomer.address.zip}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Token Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 mt-2">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 font-medium">
                  Total Tokens
                </p>
                <p className="text-2xl font-bold text-blue-800">
                  {tokenCounts.total}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-700 font-medium">Active</p>
                <p className="text-2xl font-bold text-green-800">
                  {tokenCounts.active}
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-700 font-medium">Expired</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {tokenCounts.expired}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 font-medium">Used</p>
                <p className="text-2xl font-bold text-gray-800">
                  {tokenCounts.used}
                </p>
              </div>
            </div>
          </div>

          {/* Case Notes Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
              Case Notes
            </h3>
            <div className="mt-2">
              <textarea
                value={caseNotesInput}
                onChange={(e) => setCaseNotesInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md"
                rows={4}
                placeholder="Add case notes here..."
              />
              <div className="mt-2 text-right">
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Replace the individual render functions with a combined function
  const renderTokenManagement = () => {
    const filteredTokens = getFilteredTokens();

    return (
      <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
        {/* Token Filters and List Section - Combined for cohesiveness */}
        <div className="p-6 flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
              <h3 className="text-lg font-medium text-gray-700">
                Token Management
              </h3>
            </div>
            <div className="flex items-center">
              <button
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                onClick={() =>
                  dispatch(
                    updateTokenFilters({ filterType: "clearAll", value: null })
                  )
                }
              >
                Clear Filters
              </button>
              <button
                className="ml-2 bg-white p-1 rounded-md hover:bg-gray-100 focus:outline-none"
                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              >
                <ChevronDownIcon
                  className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${isFiltersExpanded ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Display active filters as tags */}
          {(tokenFilters.status.length > 0 ||
            tokenFilters.types.length > 0 ||
            tokenFilters.dateRange.start ||
            tokenFilters.dateRange.end ||
            tokenFilters.merchant ||
            tokenFilters.searchQuery) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tokenFilters.status.map((status) => (
                <span
                  key={status}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTokenStateBadgeColor(status)}`}
                >
                  {status}
                  <button
                    type="button"
                    className="ml-1 inline-flex flex-shrink-0"
                    onClick={() =>
                      dispatch(
                        updateTokenFilters({
                          filterType: "status",
                          value: status,
                        })
                      )
                    }
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}

              {tokenFilters.types.map((type) => (
                <span
                  key={type}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTokenTypeBadgeColor(type)}`}
                >
                  {type}
                  <button
                    type="button"
                    className="ml-1 inline-flex flex-shrink-0"
                    onClick={() =>
                      dispatch(
                        updateTokenFilters({ filterType: "type", value: type })
                      )
                    }
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              ))}

              {tokenFilters.dateRange.start && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  From: {tokenFilters.dateRange.start}
                  <button
                    type="button"
                    className="ml-1 inline-flex flex-shrink-0"
                    onClick={() =>
                      dispatch(
                        updateTokenFilters({
                          filterType: "dateStart",
                          value: "",
                        })
                      )
                    }
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              )}

              {tokenFilters.dateRange.end && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Until: {tokenFilters.dateRange.end}
                  <button
                    type="button"
                    className="ml-1 inline-flex flex-shrink-0"
                    onClick={() =>
                      dispatch(
                        updateTokenFilters({ filterType: "dateEnd", value: "" })
                      )
                    }
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              )}

              {tokenFilters.merchant && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Store: {tokenFilters.merchant}
                  <button
                    type="button"
                    className="ml-1 inline-flex flex-shrink-0"
                    onClick={() =>
                      dispatch(
                        updateTokenFilters({
                          filterType: "merchant",
                          value: "",
                        })
                      )
                    }
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              )}

              {tokenFilters.searchQuery && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Search: {tokenFilters.searchQuery}
                  <button
                    type="button"
                    className="ml-1 inline-flex flex-shrink-0"
                    onClick={() => {
                      dispatch(
                        updateTokenFilters({
                          filterType: "searchQuery",
                          value: "",
                        })
                      );
                      setTokenSearchInput("");
                    }}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </span>
              )}
            </div>
          )}

          {isFiltersExpanded && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
              {/* Quick filter buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  className="px-3 py-1 text-xs bg-white border border-gray-300 shadow-sm rounded-md hover:bg-gray-50"
                  onClick={() => handleApplyPresetFilter("activeTokens")}
                >
                  Active Tokens
                </button>
                <button
                  className="px-3 py-1 text-xs bg-white border border-gray-300 shadow-sm rounded-md hover:bg-gray-50"
                  onClick={() => handleApplyPresetFilter("expiringSoon")}
                >
                  Expiring Soon
                </button>
                <button
                  className="px-3 py-1 text-xs bg-white border border-gray-300 shadow-sm rounded-md hover:bg-gray-50"
                  onClick={() => handleApplyPresetFilter("recentlyUsed")}
                >
                  Recently Used
                </button>
                <button
                  className="px-3 py-1 text-xs bg-white border border-gray-300 shadow-sm rounded-md hover:bg-gray-50"
                  onClick={() => handleApplyPresetFilter("highValue")}
                >
                  High Value
                </button>
              </div>

              {/* Filter sections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status filter */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Status
                  </p>
                  <div className="space-y-2">
                    {["Active", "Used", "Expired", "Shared"].map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={tokenFilters.status.includes(status)}
                          onChange={() =>
                            dispatch(
                              updateTokenFilters({
                                filterType: "status",
                                value: status,
                              })
                            )
                          }
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type filter */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Type</p>
                  <div className="space-y-2">
                    {["Coupon", "Reward", "ExtraBucks", "Lightning"].map(
                      (type) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={tokenFilters.types.includes(type)}
                            onChange={() =>
                              dispatch(
                                updateTokenFilters({
                                  filterType: "type",
                                  value: type,
                                })
                              )
                            }
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {type}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Date range filter */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </p>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        From:
                      </label>
                      <input
                        type="date"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-3 shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={tokenFilters.dateRange.start}
                        onChange={(e) =>
                          dispatch(
                            updateTokenFilters({
                              filterType: "dateStart",
                              value: e.target.value,
                            })
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        To:
                      </label>
                      <input
                        type="date"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-3 shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={tokenFilters.dateRange.end}
                        onChange={(e) =>
                          dispatch(
                            updateTokenFilters({
                              filterType: "dateEnd",
                              value: e.target.value,
                            })
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Merchant filter & search */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Merchant
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-3 shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Filter by store"
                      value={tokenFilters.merchant}
                      onChange={(e) =>
                        dispatch(
                          updateTokenFilters({
                            filterType: "merchant",
                            value: e.target.value,
                          })
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-3 shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search by name, description..."
                      value={tokenSearchInput}
                      onChange={(e) => {
                        setTokenSearchInput(e.target.value);
                        dispatch(
                          updateTokenFilters({
                            filterType: "searchQuery",
                            value: e.target.value,
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Token List - Integrated directly with filters */}
          {filteredTokens.length > 0 ? (
            <div className="mt-4 flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">
                  {filteredTokens.length} tokens
                </p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <button
                    className={`text-sm px-2 py-1 rounded ${tokenSort.field === "name" ? "bg-gray-100 font-medium" : ""}`}
                    onClick={() => handleSort("name")}
                  >
                    Name
                    {tokenSort.field === "name" &&
                      (tokenSort.direction === "asc" ? (
                        <ArrowUpIcon className="inline h-3 w-3 ml-1" />
                      ) : (
                        <ArrowDownIcon className="inline h-3 w-3 ml-1" />
                      ))}
                  </button>
                  <button
                    className={`text-sm px-2 py-1 rounded ${tokenSort.field === "expirationDate" ? "bg-gray-100 font-medium" : ""}`}
                    onClick={() => handleSort("expirationDate")}
                  >
                    Expiration
                    {tokenSort.field === "expirationDate" &&
                      (tokenSort.direction === "asc" ? (
                        <ArrowUpIcon className="inline h-3 w-3 ml-1" />
                      ) : (
                        <ArrowDownIcon className="inline h-3 w-3 ml-1" />
                      ))}
                  </button>
                  <button
                    className={`text-sm px-2 py-1 rounded ${tokenSort.field === "value" ? "bg-gray-100 font-medium" : ""}`}
                    onClick={() => handleSort("value")}
                  >
                    Value
                    {tokenSort.field === "value" &&
                      (tokenSort.direction === "asc" ? (
                        <ArrowUpIcon className="inline h-3 w-3 ml-1" />
                      ) : (
                        <ArrowDownIcon className="inline h-3 w-3 ml-1" />
                      ))}
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto flex-grow">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Name</span>
                          {tokenSort.field === "name" &&
                            (tokenSort.direction === "asc" ? (
                              <ArrowUpIcon className="h-4 w-4" />
                            ) : (
                              <ArrowDownIcon className="h-4 w-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("type")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Type</span>
                          {tokenSort.field === "type" &&
                            (tokenSort.direction === "asc" ? (
                              <ArrowUpIcon className="h-4 w-4" />
                            ) : (
                              <ArrowDownIcon className="h-4 w-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("state")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Status</span>
                          {tokenSort.field === "state" &&
                            (tokenSort.direction === "asc" ? (
                              <ArrowUpIcon className="h-4 w-4" />
                            ) : (
                              <ArrowDownIcon className="h-4 w-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("value")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Value</span>
                          {tokenSort.field === "value" &&
                            (tokenSort.direction === "asc" ? (
                              <ArrowUpIcon className="h-4 w-4" />
                            ) : (
                              <ArrowDownIcon className="h-4 w-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("expirationDate")}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Expires</span>
                          {tokenSort.field === "expirationDate" &&
                            (tokenSort.direction === "asc" ? (
                              <ArrowUpIcon className="h-4 w-4" />
                            ) : (
                              <ArrowDownIcon className="h-4 w-4" />
                            ))}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTokens.map((token) => (
                      <tr
                        key={token.id}
                        className={`${selectedToken?.id === token.id ? "bg-blue-50" : "hover:bg-gray-50"} cursor-pointer`}
                        onClick={() => dispatch(selectToken(token.id))}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                              <TicketIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {token.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {token.description.length > 50
                                  ? `${token.description.substring(0, 50)}...`
                                  : token.description}
                              </div>
                              {token.disputed && (
                                <div className="text-xs text-red-600 font-medium mt-1 flex items-center">
                                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                                  Disputed {token.notHonored && "(Not Honored)"}
                                </div>
                              )}
                              {token.supportActions?.isReissued && (
                                <div className="text-xs text-blue-600 font-medium mt-1 flex items-center">
                                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                                  Reissued
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTokenTypeBadgeColor(token.type)}`}
                          >
                            {token.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTokenStateBadgeColor(token.state)}`}
                          >
                            {token.state}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {token.value}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(token.expirationDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <a
                              href="https://www.cvs.com/extracare/home/"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewInExtraCare(
                                  token.externalUrl ||
                                    "https://www.cvs.com/extracare/home/"
                                );
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="View in ExtraCare"
                            >
                              <ExternalLinkIcon className="h-5 w-5" />
                            </a>
                            {token.state === "Expired" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  reissueTokenHandler(token.id);
                                }}
                                className="text-green-600 hover:text-green-900"
                                title="Reissue token"
                              >
                                <ArrowPathIcon className="h-5 w-5" />
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markTokenDisputedHandler(token.id);
                              }}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Mark as disputed"
                            >
                              <ExclamationCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTokenFromCustomerHandler(token.id);
                              }}
                              className="text-red-600 hover:text-red-900"
                              title="Remove token"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8 flex-grow flex flex-col justify-center">
              <TicketIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-lg font-medium">No tokens found</p>
              <p>Adjust your filters or add new tokens to this customer.</p>
              <button
                onClick={() =>
                  dispatch(
                    updateTokenFilters({ filterType: "clearAll", value: null })
                  )
                }
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Modify the renderTokens function to have full height
  const renderTokens = () => {
    return <div className="h-full">{renderTokenManagement()}</div>;
  };

  // Render token detail modal
  const renderTokenDetail = () => {
    if (!selectedToken) return null;

    return (
      <Dialog
        open={!!selectedToken}
        onOpenChange={(open) => {
          if (!open) {
            dispatch(selectToken(null));
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Token Details</DialogTitle>
          </DialogHeader>

          <div className="mt-2 space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{selectedToken.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p>{selectedToken.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTokenTypeBadgeColor(selectedToken.type)}`}
                >
                  {selectedToken.type}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTokenStateBadgeColor(selectedToken.state)}`}
                >
                  {selectedToken.state}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Value</p>
                <p className="font-medium">{selectedToken.value}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Merchant</p>
                <p>{selectedToken.merchantName || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Claim Date</p>
                <p>{formatDate(selectedToken.claimDate)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Expiration Date</p>
                <p>{formatDate(selectedToken.expirationDate)}</p>
              </div>
            </div>

            {selectedToken.useDate && (
              <div>
                <p className="text-sm text-gray-500">Used Date</p>
                <p>{formatDate(selectedToken.useDate)}</p>
              </div>
            )}

            {selectedToken.shareDate && (
              <div>
                <p className="text-sm text-gray-500">Shared Date</p>
                <p>{formatDate(selectedToken.shareDate)}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            {selectedToken.externalUrl && (
              <Button
                variant="primary"
                theme="cvs"
                onClick={() => handleViewInExtraCare(selectedToken.externalUrl)}
              >
                View in ExtraCare
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Function to filter catalog tokens based on search input
  const filterCatalogTokens = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredCatalogTokens(generatedTokenCatalog);
      return;
    }

    const filtered = generatedTokenCatalog.filter(
      (token) =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCatalogTokens(filtered);
  };

  // Initialize the filtered token catalog on load
  // Removing this effect since we're already initializing the state directly
  // useEffect(() => {
  //   setFilteredCatalogTokens(generatedTokenCatalog);
  // }, []);

  // Render token catalog modal for adding tokens to customers
  const renderTokenCatalogModal = () => {
    return (
      <Dialog
        open={showTokenCatalog}
        onOpenChange={(open) => {
          if (!open) {
            dispatch(toggleTokenCatalog());
          }
        }}
      >
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Add Token to Customer</DialogTitle>
            </div>
          </DialogHeader>

          <div className="mb-4">
            <label htmlFor="token-search" className="sr-only">
              Search tokens
            </label>
            <div className="relative">
              <input
                type="text"
                id="token-search"
                className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search tokens by name, description, type..."
                value={catalogSearchInput}
                onChange={(e) => {
                  setCatalogSearchInput(e.target.value);
                  filterCatalogTokens(e.target.value);
                }}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="max-h-[50vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredCatalogTokens.map((token) => (
                <div
                  key={token.id}
                  className="border rounded-lg shadow-sm p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    addTokenToCustomerHandler(token.id);
                    dispatch(toggleTokenCatalog());
                  }}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                      <TicketIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        {token.name}
                      </h4>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                        {token.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTokenTypeBadgeColor(token.type)}`}
                        >
                          {token.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {token.value}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              theme="cvs"
              onClick={() => dispatch(toggleTokenCatalog())}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Replace the renderConfirmModal function with this implementation
  const renderConfirmModal = () => {
    const getModalTitle = () => {
      switch (confirmAction) {
        case "reissue":
          return "Reissue Token";
        case "remove":
          return "Remove Token";
        case "dispute":
          return "Mark Token as Disputed";
        default:
          return "Confirm Action";
      }
    };

    const getModalIcon = () => {
      switch (confirmAction) {
        case "remove":
          return <TrashIcon className="h-6 w-6 text-red-600" />;
        case "reissue":
          return <ArrowPathIcon className="h-6 w-6 text-green-600" />;
        case "dispute":
          return <ExclamationCircleIcon className="h-6 w-6 text-yellow-600" />;
        default:
          return null;
      }
    };

    return (
      <Dialog
        open={showConfirmModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowConfirmModal(false);
            setConfirmAction(null);
            setConfirmTokenId(null);
            setConfirmReason("");
            setConfirmComments("");
            setNotHonored(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <div className="flex items-start">
              <div
                className={`mr-4 flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${
                  confirmAction === "remove"
                    ? "bg-red-100"
                    : confirmAction === "reissue"
                      ? "bg-green-100"
                      : "bg-yellow-100"
                }`}
              >
                {getModalIcon()}
              </div>
              <DialogTitle>{getModalTitle()}</DialogTitle>
            </div>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {confirmAction === "remove" && (
              <DialogDescription>
                Are you sure you want to remove this token? This action cannot
                be undone.
              </DialogDescription>
            )}

            {(confirmAction === "reissue" || confirmAction === "dispute") && (
              <>
                <div>
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Reason
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={confirmReason}
                    onChange={(e) => setConfirmReason(e.target.value)}
                  >
                    <option value="">Select a reason...</option>
                    {confirmAction === "reissue" ? (
                      <>
                        <option value="technical_error">Technical Error</option>
                        <option value="expired_prematurely">
                          Expired Prematurely
                        </option>
                        <option value="merchant_reported">
                          Merchant Reported Issue
                        </option>
                        <option value="customer_assistance">
                          Customer Assistance
                        </option>
                      </>
                    ) : (
                      <>
                        <option value="not_honored">
                          Not Honored by Merchant
                        </option>
                        <option value="error_on_receipt">
                          Error on Receipt
                        </option>
                        <option value="display_issue">
                          Display Issue in App
                        </option>
                        <option value="other">Other</option>
                      </>
                    )}
                  </select>
                </div>

                {confirmAction === "dispute" && (
                  <div className="flex items-center">
                    <input
                      id="not-honored"
                      name="not-honored"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={notHonored}
                      onChange={(e) => setNotHonored(e.target.checked)}
                    />
                    <label
                      htmlFor="not-honored"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Token was not honored by merchant
                    </label>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="comments"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Additional Comments
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    rows={3}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter any additional details..."
                    value={confirmComments}
                    onChange={(e) => setConfirmComments(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              theme="cvs"
              onClick={() => {
                setShowConfirmModal(false);
                setConfirmAction(null);
                setConfirmTokenId(null);
                setConfirmReason("");
                setConfirmComments("");
                setNotHonored(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant={confirmAction === "remove" ? "destructive" : "primary"}
              theme="cvs"
              onClick={handleConfirmAction}
              disabled={
                (confirmAction === "reissue" || confirmAction === "dispute") &&
                !confirmReason
              }
            >
              {confirmAction === "remove"
                ? "Remove"
                : confirmAction === "reissue"
                  ? "Reissue"
                  : "Mark as Disputed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Make sure the main component returns the UI
  return renderContent();

  function renderContent() {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <main>
          {/* Action Message */}
          {actionMessage && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                actionMessage.type === "success"
                  ? "bg-green-100 text-green-800"
                  : actionMessage.type === "error"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              {actionMessage.text}
            </div>
          )}

          {/* Add Token button - only on detail view */}
          {viewState === "detail" && selectedCustomer && (
            <div className="flex justify-end items-center mb-4">
              <Button
                variant="primary"
                onClick={() => dispatch(toggleTokenCatalog())}
                icon={<PlusCircleIcon className="h-4 w-4" />}
              >
                Add Token
              </Button>
            </div>
          )}

          {viewState === "main" ? (
            /* Main View: Customer Search & Table */
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Customer Lookup</h2>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    onKeyDown={handleKeyDown}
                    placeholder="Search by name, email, phone, or ExtraCare ID..."
                    className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-lg"
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                </div>

                <Button
                  variant="primary"
                  theme="cvs"
                  onClick={handleSearch}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                >
                  Search
                </Button>
              </div>

              {/* Search Results */}
              {customerResults.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">
                    Results ({customerResults.length})
                  </h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    {customerResults.map((customer) => (
                      <div
                        key={customer.id}
                        className="border-b border-gray-200 last:border-0 p-4 cursor-pointer hover:bg-gray-100"
                        onClick={() => selectCustomerHandler(customer.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">
                              <HighlightedText
                                text={`${customer.firstName} ${customer.lastName}`}
                                searchTerm={searchQuery}
                              />
                            </p>
                            <p className="text-sm text-gray-500">
                              <HighlightedText
                                text={customer.email}
                                searchTerm={searchQuery}
                              />{" "}
                              •{" "}
                              <HighlightedText
                                text={customer.phone}
                                searchTerm={searchQuery}
                              />
                            </p>
                            <p className="text-xs text-gray-500">
                              ExtraCare ID:{" "}
                              <HighlightedText
                                text={customer.extraCareId}
                                searchTerm={searchQuery}
                              />
                            </p>
                          </div>
                          <div className="text-xs text-gray-500">
                            Account Created:{" "}
                            {formatDate(customer.accountCreated)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced empty state */}
              {hasSearched && searchQuery && customerResults.length === 0 && (
                <div className="mt-6 p-8 bg-gray-50 rounded-lg text-center">
                  <ExclamationCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No customers found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't find any customers matching '{searchQuery}'
                  </p>
                  <p className="text-sm text-gray-600">
                    Try with a different search term or check for typos
                  </p>
                </div>
              )}

              {/* Initial empty state with pagination */}
              {!hasSearched && !searchQuery && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold">Customers</h3>
                    {renderPerPageSelector()}
                  </div>
                  {isClient ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Customer
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              ExtraCare ID
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Tokens
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Account Status
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {Array.isArray(getPaginatedCustomers()) &&
                            getPaginatedCustomers().map((customer) => (
                              <tr
                                key={customer.id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() =>
                                  selectCustomerHandler(customer.id)
                                }
                              >
                                <td className="px-4 py-4">
                                  <div className="flex items-center">
                                    <div
                                      className={`flex-shrink-0 h-10 w-10 ${
                                        customer.id === "cust004"
                                          ? "bg-purple-500"
                                          : customer.id === "cust005"
                                            ? "bg-pink-500"
                                            : customer.id === "cust006"
                                              ? "bg-yellow-500"
                                              : "bg-[#2563EB]"
                                      } rounded-full flex items-center justify-center text-white`}
                                    >
                                      {customer.firstName.charAt(0)}
                                      {customer.lastName.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">
                                        {customer.firstName} {customer.lastName}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {customer.email}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {customer.phone}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="text-sm text-gray-900">
                                    {customer.extraCareId}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Created:{" "}
                                    {formatDate(customer.accountCreated)}
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex flex-wrap gap-1">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Active:{" "}
                                      {
                                        customer.tokens.filter(
                                          (t) => t.state === "Active"
                                        ).length
                                      }
                                    </span>
                                    {customer.tokens.filter(
                                      (t) => t.state === "Expired"
                                    ).length > 0 && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Expired:{" "}
                                        {
                                          customer.tokens.filter(
                                            (t) => t.state === "Expired"
                                          ).length
                                        }
                                      </span>
                                    )}
                                    {customer.tokens.filter(
                                      (t) => t.state === "Used"
                                    ).length > 0 && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Used:{" "}
                                        {
                                          customer.tokens.filter(
                                            (t) => t.state === "Used"
                                          ).length
                                        }
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      customer.tokens.length > 0
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {customer.tokens.length > 0
                                      ? "Active"
                                      : "No Tokens"}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-sm text-blue-600 hover:text-blue-800">
                                  <button
                                    className="font-medium"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent row click from firing
                                      selectCustomerHandler(customer.id);
                                    }}
                                  >
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    /* Show a loading/skeleton state until client is ready */
                    <div className="animate-pulse">
                      <div className="h-10 bg-gray-200 rounded mb-4"></div>
                      <div className="h-16 bg-gray-200 rounded mb-2"></div>
                      <div className="h-16 bg-gray-200 rounded mb-2"></div>
                      <div className="h-16 bg-gray-200 rounded mb-2"></div>
                    </div>
                  )}

                  {/* Pagination - only show when client-side */}
                  {isClient && renderPagination()}
                </div>
              )}
            </div>
          ) : (
            /* Detail View: Customer Details and Token Management */
            selectedCustomer && (
              <div>
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Customer Profile - make narrower */}
                  <div className="lg:col-span-3">{renderCustomerProfile()}</div>

                  {/* Right Column: Token Management - make wider */}
                  <div className="lg:col-span-9">{renderTokens()}</div>
                </div>
              </div>
            )
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white shadow-inner border-t border-gray-200 py-4 mt-8">
          <div className="px-8 flex justify-between items-center h-full">
            <div>
              <p className="text-xs text-gray-500">
                &copy; 2023 Kigo + CVS Pharmacy. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-500">Support Portal v1.2.3</p>
            </div>
          </div>
        </footer>

        {/* Token Detail Modal */}
        {renderTokenDetail()}

        {/* Token Catalog Modal */}
        {renderTokenCatalogModal()}

        {/* Confirmation Modal */}
        {renderConfirmModal()}
      </div>
    );
  }
}
