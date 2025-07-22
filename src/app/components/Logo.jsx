
import Image from 'next/image'
import Link from 'next/link'

export const Logo = () => {
  return (
    <Link href="/" className="inline-block">
    <Image
        alt="Blog Logo"
        src="/rogeriobayer.svg"
        className="block w-[150px]"
        width="150"
        height="50"
      />
    </Link>
  );
};

export default Logo;