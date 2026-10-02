"use client";
import { AiFillHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/authSlice";
import { useToFavMutation, useGetUserByIdQuery } from "@/services/userApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface HeartProps {
  card: any;
}

const Heart: React.FC<HeartProps> = ({ card }) => {
  const user = useSelector(selectUser);
  const router = useRouter();

  const [toFav] = useToFavMutation();
  const { data: userData, refetch } = useGetUserByIdQuery(user?._id!, {
    skip: !user,
  });

  const cardId = card?._id || card?.id;

  const favourited =
    userData?.favProperties?.some((f: any) => {
      const favId = typeof f === "string" ? f : f?._id || f?.id;
      return favId === cardId;
    }) || false;

  const handleLike = async () => {
    if (!user) {
      toast.error("You must be logged in to do that");
      router.push("/auth");
      return;
    }

    try {
      await toFav(card).unwrap(); // mutation toggles it
      refetch();
      toast.success(
        favourited ? "Removed from favourites" : "Added to favourites"
      );
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.error || "Something went wrong"
      );
    }
  };
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleLike();
      }}
      aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
      className={[
        "group rounded-full p-2 transition-all duration-300",
        "backdrop-blur-md  cursor-pointer",
        favourited
          ? "bg-rose-50/60 border-rose-300 shadow-[0_0_12px_rgba(255,87,87,0.25)]"
          : "bg-white/60 border-gray-300 hover:border-gray-400 hover:bg-white/80",
      ].join(" ")}
      style={{
        transform: favourited ? "scale(1.07)" : "scale(1)",
      }}
    >
      <AiFillHeart
        size={22}
        className="transition-all duration-300 group-hover:scale-110"
        color={favourited ? "#ff3b5c" : "#9ca3af"}
      />
    </button>
  );
};

export default Heart;
