import { useLoaderData } from "remix";
import { PrismaClient } from '@prisma/client'


export function loader(){
  const prisma = new PrismaClient()

  return prisma.user.findMany()
}

export default function Index() {
  const data = useLoaderData()
  console.log('data',data)
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
        Read
        
    </div>
  );
}
