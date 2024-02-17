import { Link } from "@remix-run/react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export const Hero = () => {
  return (
    <div className="container flex justify-center px-4 md:px-6 flex-1 py-8">
      <div className="flex flex-col items-center space-y-4 text-center p-4 md:w-1/2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
          A{" "}
          <span className="font-extrabold bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text bg-300% animate-gradient">
            Simple Starter
          </span>{" "}
          For Remix and Shadcn-ui
        </h1>

        <p className="text-muted-foreground font-bold mt-2">
          With optimistic dark-mode
        </p>

        <Card className="relative group overflow-hidden rounded-lg">
          <CardContent className="p-1 bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 bg-300% animate-gradient">
            <Button asChild>
              <Link to="https://github.com/rajeshdavidbabu/remix-shadcn-starter">
                Star on Github
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
