import React from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function UserTypeSelector({ userType, setUserType, onClickHandler }: UserTypeSelectorParams) {
  const accessChangeHandler = (type: UserType) => {
    setUserType(type);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onClickHandler && onClickHandler(type);
  }

  return (
    <Select value={userType} onValueChange={(type: UserType) => accessChangeHandler(type)}>
      <SelectTrigger className="shad-select">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-none bg-dark-200">
        <SelectItem className="shad-select-item" value="viewer">can view</SelectItem>
        <SelectItem className="shad-select-item" value="editor">can edit</SelectItem>
      </SelectContent>
    </Select>

  )
}
