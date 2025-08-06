import type { WeatherData } from "@/api/types"
import { useFavorites } from "@/hooks/use-favorite"
import { Button } from "./ui/button"
import { Star } from "lucide-react"
import { toast } from "sonner"

interface favoriteButtonProps{
  data : WeatherData
}

export const FavoriteButton = ({data}: favoriteButtonProps ) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const isCurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon)
  
  const handleToggleFavorite = ()=>{
    if(isCurrentlyFavorite){
      removeFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`)
      toast.error(`Removed ${data.name} from Favorites`)
    }
    else{
      addFavorite.mutate({
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon
      })
      toast.success(`Added ${data.name} to Favorites Successfully`)
    }
  }

  return (
    <Button
      variant={isCurrentlyFavorite ? "default" : "outline"}
      size="icon"
      onClick={handleToggleFavorite}
      className={isCurrentlyFavorite ? "bg-yellow-500 hover:bg-yellow-600" : ""}
    >
      <Star
        className={`h-4 w-4 ${isCurrentlyFavorite ? "fill-current" : ""}`}
      />
    </Button>
  );
}
