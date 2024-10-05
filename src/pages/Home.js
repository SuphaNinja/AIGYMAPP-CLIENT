import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/lib/axiosInstance"
import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import StarRating from "@/components/ui/StarRating"
import { ChevronLeft, ChevronRight, Star, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Home() {
    const [activeComponent, setActiveComponent] = useState("guide")
    const scrollRef = useRef < HTMLDivElement > (null)
    const [containerWidth, setContainerWidth] = useState < number | null > (null)

    const { data: allTrainerData } = useQuery({
        queryKey: ["trainers"],
        queryFn: () => axiosInstance.get("/get-all-trainers"),
    })

    const { data: currentUserData } = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axiosInstance.get("/get-current-user"),
    })

    const { data: allProductsData, isLoading: isProductsLoading } = useQuery({
        queryKey: ["allProducts"],
        queryFn: () => axiosInstance.get("/get-all-products"),
    })

    const user = currentUserData?.data?.success
    const products = allProductsData?.data?.products

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -290, behavior: 'smooth' })
        }
    }

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 290, behavior: 'smooth' })
        }
    }

    useEffect(() => {
        if (scrollRef.current) {
            const totalWidth = scrollRef.current.scrollWidth
            setContainerWidth(totalWidth)
        }
    }, [products?.specialProducts])

    const renderComponent = () => {
        switch (activeComponent) {
            case 'guide':
                return <GuideText user={user} />
            case "trainers":
                return <OurTrainers trainers={allTrainerData?.data?.success} />
            default:
                return null
        }
    }

    return (
        <div className="flex w-full flex-col">
            <div className="relative w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70" />
                <img
                    className="h-[60vh] w-full object-cover brightness-75"
                    src="https://t3.ftcdn.net/jpg/03/50/81/90/360_F_350819076_VYSOrEOhrEFYiRLTEX4QPzYWyFKHOKgj.jpg"
                    alt="Gym background"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-4xl space-y-8 p-8 text-white">
                        <h1 className="text-center text-4xl font-extrabold leading-tight tracking-tighter md:text-6xl">
                            Unleash your inner beast!
                        </h1>
                        <div className="flex justify-center space-x-4">
                            <Button
                                variant={activeComponent === 'guide' ? "default" : "outline"}
                                onClick={() => setActiveComponent('guide')}
                                className="text-lg"
                            >
                                Guide
                            </Button>
                            <Button
                                variant={activeComponent === 'trainers' ? "default" : "outline"}
                                onClick={() => setActiveComponent('trainers')}
                                className="text-lg"
                            >
                                Our trainers
                            </Button>
                        </div>
                        <div className="rounded-lg bg-white/10 p-6 backdrop-blur-lg">
                            {renderComponent()}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-background py-12">
                <div className="container mx-auto px-4">
                    <h2 className="mb-8 text-center text-3xl font-bold">Our Shop</h2>
                    <div className="relative">
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full"
                            onClick={scrollLeft}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <ScrollArea
                            ref={scrollRef}
                            className="w-full"
                            style={{ maxWidth: containerWidth || undefined }}
                        >
                            <div className="flex space-x-4 p-4">
                                {products?.specialProducts.map((product, index) => (
                                    <RecommendedProducts
                                        key={index}
                                        product={product}
                                        user={user}
                                        isLoading={isProductsLoading}
                                    />
                                ))}
                            </div>
                        </ScrollArea>
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full"
                            onClick={scrollRight}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const GuideText = ({ user }) => {
    return (
        <div className="space-y-4 text-center">
            <h2 className="text-2xl font-semibold">Your Personalized Path to Success!</h2>
            <p className="text-lg">
                We offer a personalized guide to success, where every step is crafted to match your specific goals.
                Whether it's shedding pounds, building muscle, or boosting overall fitness, we have the perfect guide for you!
            </p>
            <p className="text-lg">
                With a personal trainer to guide you along the way, we'll make sure you reach your goals in no time!
            </p>
            {user ? (
                <Button asChild size="lg">
                    <Link to="/newclient">Start your journey!</Link>
                </Button>
            ) : (
                <div className="flex justify-center space-x-4">
                    <Button asChild size="lg">
                        <Link to="/signup">Sign up!</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                        <Link to="/login">Login!</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}

const OurTrainers = ({ trainers }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-center text-2xl font-semibold">Meet Our Expert Trainers</h2>
            <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                    {Object.values(trainers || {}).map((trainer, index) => (
                        <Card key={index}>
                            <CardContent className="flex items-center p-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={trainer.profileImage} alt={trainer.userName} />
                                    <AvatarFallback>{trainer.userName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="ml-4 flex-1">
                                    <h3 className="text-lg font-semibold">{trainer.userName}</h3>
                                    <p className="text-sm text-muted-foreground">{trainer.email}</p>
                                    <p className="text-sm">{trainer.firstName} {trainer.lastName}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold">{trainer.clients.length}</p>
                                    <p className="text-sm text-muted-foreground">Clients</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

const RecommendedProducts = ({ product, user, isLoading }) => {
    const queryClient = useQueryClient()

    const addToCart = useMutation({
        mutationFn: () => axiosInstance.post("/add-to-cart", { productId: product.id, productPrice: product.price }),
        onSuccess: (data) => {
            if (data.data.success) { toast.success(data.data.success) }
            if (data.data.error) { toast.error(data.data.error) }
            queryClient.invalidateQueries(["currentUser"])
        },
    })

    if (isLoading) {
        return <ProductSkeleton />
    }

    return (
        <Card className="w-[300px] flex-shrink-0">
            <CardHeader className="p-0">
                <img
                    src={product.imageUrl}
                    alt={`Image of ${product.title}`}
                    className="h-48 w-full rounded-t-lg object-cover"
                />
            </CardHeader>
            <CardContent className="p-4">
                <CardTitle className="mb-2 line-clamp-1">{product.title}</CardTitle>
                <div className="mb-2 flex items-center justify-between">
                    <StarRating rating={product.rating} />
                    <p className="font-semibold">${product.price}</p>
                </div>
                <p className="text-sm text-muted-foreground">In stock: {product.quantity}</p>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
                <Button asChild variant="outline">
                    <Link to={`/productpage/${product.id}`}>View</Link>
                </Button>
                {user?.email ? (
                    <Button onClick={() => addToCart.mutate()}>Add to cart</Button>
                ) : (
                    <Button asChild>
                        <Link to="/login">Login</Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

const ProductSkeleton = () => (
    <Card className="w-[300px] flex-shrink-0">
        <CardHeader className="p-0">
            <Skeleton className="h-48 w-full rounded-t-lg" />
        </CardHeader>
        <CardContent className="p-4">
            <Skeleton className="mb-2 h-6 w-3/4" />
            <div className="mb-2 flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-1/2" />
        </CardContent>
        <CardFooter className="flex justify-between p-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
        </CardFooter>
    </Card>
)

