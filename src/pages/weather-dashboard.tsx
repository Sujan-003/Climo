import { Button } from "@/components/ui/button"
import { AlertTriangle, MapPin, RefreshCw} from 'lucide-react'
import { useGeolocation } from "@/hooks/use-geolocation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import WeatherSkeleton from '../components/loading-skeleton/weather-skeleton'
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/use-weather"
import CurrentWeather from '../components/current-weather'
import { HourlyTemperature } from "@/components/hourly-temperature"
import { WeatherDetails } from "@/components/weather-details"
import { WeatherForecast } from "@/components/weather-forecast"
import { FavoriteCities } from "@/components/favorite-cities"

export const WeatherDashboard = () => {
const {
  coordinates  : locationData,
  isLoading,
  error : locationError,
  getLocation
} = useGeolocation()

const weatherQuery = useWeatherQuery(locationData)
const locationQuery = useReverseGeocodeQuery(locationData)
const forecastQuery = useForecastQuery(locationData)

const locationName = locationQuery.data?.[0];

const refreshData = () => {
  getLocation()
  if(locationData){
    weatherQuery.refetch()
    locationQuery.refetch()
    forecastQuery.refetch()
  }
}

if(isLoading){
  <WeatherSkeleton />
}

if(locationError){
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Location Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{locationError}</p>
        <Button variant="outline" onClick={getLocation} className="w-fit">
          <MapPin className="mr-2 h-4 w-4" />
          Enable Location
        </Button>
      </AlertDescription>
    </Alert>
  );
}

if(!locationData){
    return (
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable location access to see your local weather.</p>
          <Button variant="outline" onClick={getLocation} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
}

if(weatherQuery.error || forecastQuery.error){
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Failed to fetch weather data, please refresh</p>
        <Button variant="outline" onClick={refreshData} className="w-fit">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}

if(!weatherQuery.data || !forecastQuery.data){
  return <WeatherSkeleton />
}


  return (
    <div className="overflow-x-hidden">
      <FavoriteCities />
      <div className="flex items-center justify-between" >
        <h1 className="text-xl font-bold tracking-tight" >My Location</h1>
        <Button 
        variant={"outline"}
        size={"icon"}
        onClick={refreshData}
        disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw  className={`h-4 w-4 ${
            weatherQuery.isFetching ? 'animate-spin' : ""}`}
          / >
        </Button>
      </div>

      <div className="mt-2 grid gap-6">
            <div className="flex flex-col lg:flex-row gap-4">
                <CurrentWeather
                data = {weatherQuery.data}
                locationName= {locationName}
                />
                <HourlyTemperature data= {forecastQuery.data}/>
            </div>
            <div className="grid gap-6 md:grid-cols-2 items-start">
              <WeatherDetails data={weatherQuery.data}/>
              <WeatherForecast data={forecastQuery.data} />
            </div>
      </div>





    </div>
  )
}
