import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/shadcn/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from "@/shadcn/components/ui/use-toast";
import { Skeleton } from "@/shadcn/components/ui/skeleton";