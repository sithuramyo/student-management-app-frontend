import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarButton } from "./sidebar-button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";

interface DropdownProps {
  dropdownItem: DropdownMenuItems;
}

export const DropdownButton = (props: DropdownProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const contextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contextRef.current) {
      if (isOpen) {
        requestAnimationFrame(() => {
          contextRef.current!.style.height = `${
            contextRef.current!.scrollHeight
          }px`;
        });
      } else {
        contextRef.current!.style.height = "0px";
      }
    }
  }, [isOpen]);

  return (
    <div>
      <Button
        variant="ghost"
        className="gap-2 justify-start w-full flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {props.dropdownItem.icon && <props.dropdownItem.icon size={20} />}
        {props.dropdownItem.label}
        {isOpen ? (
          <ChevronUp className="ml-auto" />
        ) : (
          <ChevronDown className="ml-auto" />
        )}
      </Button>
      <div
        ref={contextRef}
        className={`overflow-hidden transition-height duration-500 ease-in-out`}
        style={{ height: "0px" }}
      >
        {props.dropdownItem.value.map((item, index) => (
          <Link href={item.href || ""} key={index}>
            <SidebarButton
              variant={pathname === item.href ? "secondary" : "ghost"}
              style={{
                width: "100%",
              }}
            >
              <div className="gap-2 pl-7 justify-start w-full flex items-center">
                {item.icon && <item.icon size={20} />}
                {item.label}
              </div>
            </SidebarButton>
          </Link>
        ))}
      </div>
    </div>
  );
};