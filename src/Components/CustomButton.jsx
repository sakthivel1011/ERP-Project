import { Button, CircularProgress } from "@mui/material";
import "../components/CustomButton.scss";

export default function CustomButton({
  children,
  variant = "contained",
  buttonType = "primary",
  size = "medium",
  loading = false,
  type = "button",
  startIcon,
  endIcon,
  disabled=false,
  ...props
  
}) {
  return (
    <Button
      className={`custom-button ${buttonType}`}
      variant={variant}
      size={size}
      startIcon={!loading ? startIcon : null}
      endIcon={!loading ? endIcon : null}
      disabled={loading || disabled}
      type={type}
      {...props}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : children}
    </Button>
  );
}
