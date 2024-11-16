import Pricing from "@/components/pricing/Pricing";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";

const pricing = async () => {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Pricing user={session?.user} />
    </>
  );
};

export default pricing;
