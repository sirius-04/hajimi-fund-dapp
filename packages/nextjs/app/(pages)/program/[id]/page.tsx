import React from "react";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  return <div className="mt-18 container mx-auto">{params.id}</div>;
};

export default Page;
