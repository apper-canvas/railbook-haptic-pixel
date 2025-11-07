import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

const Home = lazy(() => import("@/components/pages/Home"));
const SearchResults = lazy(() => import("@/components/pages/SearchResults"));
const SeatSelection = lazy(() => import("@/components/pages/SeatSelection"));
const PassengerDetails = lazy(() => import("@/components/pages/PassengerDetails"));
const ReviewPayment = lazy(() => import("@/components/pages/ReviewPayment"));
const BookingConfirmation = lazy(() => import("@/components/pages/BookingConfirmation"));
const MyBookings = lazy(() => import("@/components/pages/MyBookings"));
const TrainStatus = lazy(() => import("@/components/pages/TrainStatus"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-gray-600 font-medium">Loading RailBook...</p>
    </div>
  </div>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "search",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SearchResults />
      </Suspense>
    ),
  },
  {
    path: "seat-selection",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <SeatSelection />
      </Suspense>
    ),
  },
  {
    path: "passenger-details",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PassengerDetails />
      </Suspense>
    ),
  },
  {
    path: "review-payment",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ReviewPayment />
      </Suspense>
    ),
  },
  {
    path: "booking-confirmation",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <BookingConfirmation />
      </Suspense>
    ),
  },
  {
    path: "my-bookings",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <MyBookings />
      </Suspense>
    ),
  },
  {
    path: "train-status",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <TrainStatus />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    ),
  },
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes],
  },
];

export const router = createBrowserRouter(routes);