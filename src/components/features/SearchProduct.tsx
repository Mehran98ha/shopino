'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import useMediaQuery from '@/hooks/use-media-query'
import { useSearchProducts } from '@/hooks/use-product'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useQueryState } from 'nuqs'
import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Skeleton } from '../ui/skeleton'

const ProductSkeleton = () =>
  Array.from({ length: 3 }, (_, i) => i).map((i) => (
    <div key={i} className="flex items-center gap-4 border-b py-2">
      <Skeleton className="size-16 rounded-lg" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  ))

const Trigger = (
  <Button
    variant={'outline'}
    className="h-9 max-w-xs flex-1 gap-4 font-normal text-muted-foreground backdrop-blur-sm"
  >
    <SearchIcon />
    Search products
  </Button>
)

const Products = ({
  products,
  onClose,
}: { products: any[]; onClose: () => void }) => {
  return (
    <ScrollArea className={products ? 'h-60' : 'h-0'}>
      {products?.map((product: any) => (
        <Link
          key={product.id}
          className="flex items-center gap-4 border-b py-2"
          onClick={onClose}
          href={`/products/${product.id}`}
        >
          <img
            src={product.images[0]}
            alt="product"
            className="size-16 rounded-lg object-cover"
          />
          <div>
            <p className="line-clamp-1 font-medium text-sm/6">
              {product.title}
            </p>
            <p className="text-muted-foreground text-xs">${product.price}.00</p>
          </div>
        </Link>
      ))}
    </ScrollArea>
  )
}

export default () => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useQueryState('filter', { defaultValue: '' })
  const { mutateAsync, isPending, data } = useSearchProducts()
  const debounced = useDebouncedCallback(async (value: string) => {
    if (!value.trim()) {
      return setQuery(null)
    }
    setQuery(value.trim())
    await mutateAsync(value)
  }, 500)

  useEffect(() => {
    if (query) {
      debounced(query)
    }
  }, [])

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{Trigger}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Products</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <Input
            type="text"
            placeholder="search"
            defaultValue={query}
            onChange={(e) => debounced(e.target.value)}
          />
          {isPending ? (
            <div className="h-60">
              <ProductSkeleton />
            </div>
          ) : data?.length ? (
            <Products products={data} onClose={() => setOpen(false)} />
          ) : query ? (
            <div className="mt-4 flex flex-col items-center gap-4 text-center text-muted-foreground">
              <SearchIcon className="size-16" />
              <p className="font-medium">No products found</p>
              <p className="text-sm">
                We couldn't find any products matching "
                <span className="font-semibold">{query}</span>". Try again with
                a different keyword.
              </p>
              <Button variant="outline" onClick={() => setQuery('')}>
                Clear Search
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Start typing to search for products...
            </p>
          )}
        </DialogContent>
      </Dialog>
    )

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{Trigger}</DrawerTrigger>
      <DrawerContent className="min-h-[60%]">
        <DrawerHeader>
          <DrawerTitle>Search Products</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>
        <div className="grid gap-4 px-4">
          <Input
            type="text"
            placeholder="search"
            defaultValue={query}
            onChange={(e) => debounced(e.target.value)}
          />
          {isPending ? (
            <div className="h-60">
              <ProductSkeleton />
            </div>
          ) : (
            <Products products={data} onClose={() => setOpen(false)} />
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
