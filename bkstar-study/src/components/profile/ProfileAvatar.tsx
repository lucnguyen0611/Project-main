import React, { useState, useRef } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import type { Avatar as AvatarType } from "@/types/profile.types";

interface ProfileAvatarProps {
  currentAvatar?: AvatarType | null;
  previewUrl?: string | null;
  onAvatarChange: (file: File) => void;
  onAvatarRemove: () => void;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  currentAvatar,
  previewUrl: externalPreviewUrl,
  onAvatarChange,
  onAvatarRemove,
}) => {
  const [internalPreviewUrl, setInternalPreviewUrl] = useState<string | null>(
    currentAvatar?.url || null
  );

  // Use external preview URL if provided, otherwise use internal one
  const displayPreviewUrl = externalPreviewUrl || internalPreviewUrl;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Chỉ chấp nhận file JPG, PNG, GIF");
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File không được lớn hơn 2MB");
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setInternalPreviewUrl(url);
      onAvatarChange(file);
    }
  };

  const handleRemoveAvatar = () => {
    setInternalPreviewUrl(null);
    onAvatarRemove();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box sx={{ textAlign: "center", mb: 3 }}>
      <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
        <Avatar
          src={displayPreviewUrl || undefined}
          sx={{
            width: 120,
            height: 120,
            fontSize: "3rem",
            bgcolor: "grey.400",
            border: "4px solid white",
            boxShadow: 3,
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: 4,
            },
          }}
        >
          {!displayPreviewUrl && getInitials("Admin")}
        </Avatar>

        {/* Camera icon overlay */}
        <IconButton
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <PhotoCameraIcon />
        </IconButton>

        {/* Remove button if has avatar */}
        {displayPreviewUrl && (
          <Tooltip title="Xóa ảnh">
            <IconButton
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                bgcolor: "error.main",
                color: "white",
                "&:hover": {
                  bgcolor: "error.dark",
                },
              }}
              onClick={handleRemoveAvatar}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Upload Button - Now below avatar */}
      <Box sx={{ mb: 1 }}>
        <Button
          variant="outlined"
          onClick={() => fileInputRef.current?.click()}
          sx={{
            minWidth: "auto",
            px: 2,
            py: 1,
            fontSize: "0.875rem",
            fontWeight: 500,
            textTransform: "none",
            borderWidth: 1.5,
            "&:hover": {
              borderWidth: 2,
            },
          }}
        >
          TẢI LÊN
        </Button>
      </Box>

      {/* Helper Text */}
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        sx={{
          fontSize: "0.75rem",
          lineHeight: 1.4,
          opacity: 0.8,
        }}
      >
        Chấp nhận JPG, PNG, GIF (tối đa 2MB)
      </Typography>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />
    </Box>
  );
};
