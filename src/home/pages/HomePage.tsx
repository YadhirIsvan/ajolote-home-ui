import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFeaturedProperties } from "@/home/hooks/use-featured-properties.home.hook";
import { useHomeCities } from "@/home/hooks/use-home-cities.home.hook";
import HeroSection from "@/home/components/HeroSection";
import TrustBar from "@/home/components/TrustBar";
import StepsSection from "@/home/components/StepsSection";
import FeaturedPropertiesSection from "@/home/components/FeaturedPropertiesSection";

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState("");

  const { cities, isLoading: isLoadingCities } = useHomeCities();
  const { properties, isLoading } = useFeaturedProperties({
    zone: selectedCity || undefined,
    limit: 20,
    offset: 0,
  });

  const handleSearch = () => {
    if (selectedCity) {
      navigate(`/comprar?zone=${encodeURIComponent(selectedCity)}`);
    } else {
      navigate("/comprar");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        cities={cities}
        isLoadingCities={isLoadingCities}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        onSearch={handleSearch}
      />
      <TrustBar />
      <StepsSection />
      <FeaturedPropertiesSection properties={properties} isLoading={isLoading} />
    </div>
  );
};

export default HomePage;
